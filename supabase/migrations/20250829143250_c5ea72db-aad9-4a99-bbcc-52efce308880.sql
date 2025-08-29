-- Create email_captures table to store all collected emails
CREATE TABLE public.email_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'email_capture_page',
  user_agent TEXT,
  ip_address TEXT,
  user_id UUID,
  assessment_result_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Create policies for email_captures
CREATE POLICY "Users can view their own email captures" 
ON public.email_captures 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own email captures" 
ON public.email_captures 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create index for better performance
CREATE INDEX idx_email_captures_email ON public.email_captures(email);
CREATE INDEX idx_email_captures_user_id ON public.email_captures(user_id);
CREATE INDEX idx_email_captures_captured_at ON public.email_captures(captured_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_email_captures_updated_at
BEFORE UPDATE ON public.email_captures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();