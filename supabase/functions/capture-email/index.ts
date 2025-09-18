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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source = 'email_capture_page', userAgent }: EmailCaptureRequest = await req.json();

    console.log('Capturing email:', email);

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Store the email capture
    const { data: emailCapture, error: emailError } = await supabase
      .from('email_captures')
      .insert({
        email,
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
      .eq('email', email)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userCheckError);
    }

    if (!existingUser) {
      // Create new user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          email,
        });

      if (userError) {
        console.error('Error creating user:', userError);
        // Don't throw error here - email capture was successful
      } else {
        console.log('New user created for email:', email);
      }
    }

    console.log('Email captured successfully:', email);

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