import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, ArrowRight, Download } from 'lucide-react';
import { calculateResults } from '@/lib/scoring';

const EmailCapture = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPDFRequest, setIsPDFRequest] = useState(false);

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
      // Check if answers exist in localStorage
      const savedAnswers = localStorage.getItem('funding-readiness-answers');
      if (!savedAnswers) {
        toast.error('Please complete the assessment first.');
        navigate('/checklist');
        return;
      }

      // Sign up or sign in with email (magic link)
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/results`
        }
      });

      if (error) throw error;

      // Always generate and download PDF, and send via email
      await generateAndDownloadPDF(email);
      sessionStorage.removeItem('requestPDF');
      toast.success('PDF downloaded and sent to your email! Redirecting to workshop signup...');
      
      // Redirect to workshop signup after a short delay
      setTimeout(() => {
        navigate('/workshop-signup');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndDownloadPDF = async (userEmail: string) => {
    try {
      const savedAnswers = localStorage.getItem('funding-readiness-answers');
      if (!savedAnswers) return null;

      const answers = JSON.parse(savedAnswers);
      const results = calculateResults(answers);

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { 
          results,
          userEmail
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

  const sendPDFViaEmail = async (userEmail: string, pdfData: string) => {
    try {
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Your Funding Readiness Results</h1>
          <p>Thank you for completing our funding readiness assessment!</p>
          <p>Please find your detailed PDF results attached to this email.</p>
          <p>Next step: Join our upcoming workshop to turn these insights into a fundable package.</p>
          <p style="color: #64748b; margin-top: 30px;">
            Best regards,<br>
            The Funding Readiness Team
          </p>
        </div>
      `;

      await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: 'Your Funding Readiness Results - PDF Attached',
          htmlContent: welcomeHtml,
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