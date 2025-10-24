import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, ArrowRight, Download } from 'lucide-react';
import { calculateResults } from '@/lib/scoring';
import { PROFILE_COPY } from '@/lib/copy';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" })
});

const EmailCapture = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPDFRequest, setIsPDFRequest] = useState(false);
  const [consentToSaveData, setConsentToSaveData] = useState(true);

  useEffect(() => {
    // Check if this is a PDF download request
    const pdfRequest = sessionStorage.getItem('requestPDF');
    if (pdfRequest === 'true') {
      setIsPDFRequest(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email
      const validation = emailSchema.safeParse({ email: email.trim() });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setIsLoading(false);
        return;
      }
      
      const validatedEmail = validation.data.email;
      
      // Check if answers exist in localStorage
      const savedResults = localStorage.getItem('funding-readiness-results');
      const savedAnswers = localStorage.getItem('funding-readiness-answers');
      if (!savedResults && !savedAnswers) {
        toast.error('Please complete the assessment first.');
        navigate('/checklist');
        return;
      }

      // Always capture email first (regardless of consent)
      await captureEmail(validatedEmail);

      // Send confirmation email first
      await sendConfirmationEmail(validatedEmail);
      
      // Generate and download PDF, and send via email (no email verification needed)
      await generateAndDownloadPDF(validatedEmail, consentToSaveData);
      sessionStorage.removeItem('requestPDF');
      
      // Mark that email was provided for full results access
      sessionStorage.setItem('emailProvided', 'true');
      
      toast.success('Check your email! Redirecting back to your full results...');
      
      // Redirect back to results page to show full details
      setTimeout(() => {
        navigate('/results');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error processing request:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const captureEmail = async (userEmail: string) => {
    try {
      // Store email capture record (always, regardless of consent)
      const { error } = await supabase.functions.invoke('capture-email', {
        body: {
          email: userEmail,
          source: 'email_capture_page',
          userAgent: navigator.userAgent
        }
      });

      if (error) {
        console.error('Error capturing email:', error);
        // Don't block the flow if email capture fails
      }
    } catch (error) {
      console.error('Error in captureEmail:', error);
      // Don't block the flow if email capture fails
    }
  };

  const generateAndDownloadPDF = async (userEmail: string, saveToDatabase: boolean = false) => {
    try {
      // Prefer precomputed results to avoid relying on answers
      const savedResults = localStorage.getItem('funding-readiness-results');
      let results: any;
      let answers: any;
      
      if (savedResults) {
        results = JSON.parse(savedResults);
      } else {
        const savedAnswers = localStorage.getItem('funding-readiness-answers');
        if (!savedAnswers) {
          toast.error('Please complete the assessment first.');
          return null;
        }
        answers = JSON.parse(savedAnswers);
        results = calculateResults(answers);
      }

      // Get answers for database storage if not already loaded
      if (!answers) {
        const savedAnswers = localStorage.getItem('funding-readiness-answers');
        if (savedAnswers) {
          answers = JSON.parse(savedAnswers);
        }
      }

      // Get profile details from copy
      const profileDetails = PROFILE_COPY[results.profile as keyof typeof PROFILE_COPY];

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { 
          results,
          profileDetails,
          userEmail,
          saveToDatabase,
          answers
        }
      });

      if (error) throw error;

      // Decode base64 PDF data and download
      const pdfData = data.pdfData;
      const byteArray = Uint8Array.from(atob(pdfData), c => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'funding-readiness-results.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Send PDF via email
      await sendPDFViaEmail(userEmail, pdfData);
      
      return pdfData;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
      return null;
    }
  };

  const sendConfirmationEmail = async (userEmail: string) => {
    try {
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 20px;">Welcome to Your Funding Readiness Journey! 🎉</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Thank you for completing our funding readiness assessment! We're excited to support you on your path to securing funding for your program.
          </p>
          
          <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 16px; margin: 24px 0;">
            <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 12px 0;">✅ What's Next</h2>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li style="margin-bottom: 8px;">Your detailed PDF results are on their way in a separate email</li>
              <li style="margin-bottom: 8px;">Review your personalized profile and recommendations</li>
              <li style="margin-bottom: 8px;">Check out our Funding-Ready Workshop to turn insights into action</li>
            </ul>
          </div>
          
          <div style="margin: 32px 0; text-align: center;">
            <a href="https://yammservices.com/funding-ready-program/" 
               style="display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Learn About Our Workshop
            </a>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-top: 32px;">
            Questions? We're here to help. Reply to this email or visit our website.
          </p>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Best regards,<br>
            <strong>The Funding Readiness Team</strong>
          </p>
        </div>
      `;

      await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: '🎉 Your Funding Readiness Assessment is Complete!',
          htmlContent: confirmationHtml
        }
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't block flow if confirmation fails
    }
  };

  const sendPDFViaEmail = async (userEmail: string, pdfData: string) => {
    try {
      const pdfEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1; font-size: 22px; margin-bottom: 16px;">📊 Your Funding Readiness Results (PDF)</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            As promised, here's your detailed funding readiness assessment report attached to this email.
          </p>
          
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #475569;">
              💡 <strong>Pro Tip:</strong> Save this PDF for reference and share it with your team to discuss next steps together.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            Ready to take action? Our Funding-Ready Workshop can help you transform these insights into a comprehensive funding package.
          </p>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Best regards,<br>
            <strong>The Funding Readiness Team</strong>
          </p>
        </div>
      `;

      await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: '📊 Your Funding Readiness Results - PDF Report',
          htmlContent: pdfEmailHtml,
          attachments: [{
            filename: 'funding-readiness-results.pdf',
            content: pdfData
          }]
        }
      });
    } catch (error) {
      console.error('Error sending PDF email:', error);
      // Don't show error to user, just log it
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Get Your Results
          </h1>
          <p className="text-muted-foreground">
            Enter your email to access your funding readiness results and get future updates about our workshop.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              {isPDFRequest ? (
                <Download className="w-6 h-6 text-primary" />
              ) : (
                <Mail className="w-6 h-6 text-primary" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              {isPDFRequest ? 'Download Your PDF Results' : 'Almost There!'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isPDFRequest 
                ? 'Enter your email to download your PDF results and get access to your full assessment.' 
                : 'We\'ll send you a secure link to view your personalized funding readiness results.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  {isPDFRequest ? 'Download PDF Results' : 'Get My Results'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-start space-x-3 mt-4">
            <Checkbox
              id="consent"
              checked={consentToSaveData}
              onCheckedChange={(checked) => setConsentToSaveData(!!checked)}
              className="mt-1"
            />
            <label
              htmlFor="consent"
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              I consent to having my assessment data (email, answers, results, and PDF) saved in your database for future reference and potential follow-up communications. You can opt out at any time.
            </label>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            By providing your email, you agree to receive updates about our funding readiness workshop.
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;