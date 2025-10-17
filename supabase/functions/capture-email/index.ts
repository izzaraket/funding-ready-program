import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailCaptureRequest {
  email: string;
  source?: string;
  userAgent?: string;
  ipAddress?: string;
}

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 255;

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email cannot be empty' };
  }
  
  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` };
  }
  
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

// Simple rate limiting by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ipAddress: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = rateLimitMap.get(ipAddress);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ipAddress, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, error: 'Too many requests. Please try again later.' };
  }
  
  record.count++;
  return { allowed: true };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source = 'email_capture_page', userAgent }: EmailCaptureRequest = await req.json();

    // Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    const rateLimitCheck = checkRateLimit(ipAddress);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: rateLimitCheck.error 
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: emailValidation.error 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();
    console.log('Capturing email from IP:', ipAddress.substring(0, 8));

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the email capture
    const { data: emailCapture, error: emailError } = await supabase
      .from('email_captures')
      .insert({
        email: sanitizedEmail,
        source,
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (emailError) {
      console.error('Error saving email capture:', emailError);
      throw emailError;
    }

    // Create or update user record
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', sanitizedEmail)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userCheckError);
    }

    if (!existingUser) {
      // Create new user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          email: sanitizedEmail,
        });

      if (userError) {
        console.error('Error creating user:', userError);
        // Don't throw error here - email capture was successful
      } else {
        console.log('New user created');
      }
    }

    console.log('Email captured successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email captured successfully',
        emailCaptureId: emailCapture.id
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in capture-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);