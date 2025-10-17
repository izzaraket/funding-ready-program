import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
  }>;
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
const MAX_REQUESTS_PER_WINDOW = 3; // Lower limit for email sending

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
    const { to, subject, htmlContent, attachments }: EmailRequest = await req.json();

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
    const emailValidation = validateEmail(to);
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

    const sanitizedEmail = to.trim().toLowerCase();
    console.log('Sending email to validated recipient');

    const emailPayload: any = {
      from: "Funding Readiness Checklist <info@yammservices.com>",
      to: [sanitizedEmail],
      subject,
      html: htmlContent,
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
      }));
    }

    const emailResponse = await resend.emails.send(emailPayload);

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data?.id,
      message: "Email sent successfully"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);