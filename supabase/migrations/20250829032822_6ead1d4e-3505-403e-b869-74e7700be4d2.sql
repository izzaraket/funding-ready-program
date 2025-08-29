-- Add new columns to assessment_results table for email, PDF storage, and consent
ALTER TABLE public.assessment_results 
ADD COLUMN email TEXT,
ADD COLUMN pdf_data TEXT, -- base64 encoded PDF
ADD COLUMN data_storage_consent BOOLEAN DEFAULT false;