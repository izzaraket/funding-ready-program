import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, ArrowRight } from 'lucide-react';

const EmailCapture = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      toast.success('Check your email for the magic link to view your results!');
      
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Almost There!
            </h2>
            <p className="text-muted-foreground text-sm">
              We'll send you a secure link to view your personalized funding readiness results.
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
                  Get My Results
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