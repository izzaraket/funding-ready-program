
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BarMeter from '../components/BarMeter';
import ProfileCard from '../components/ProfileCard';
import { calculateResults } from '../lib/scoring';
import type { ScoreLevel, AssessmentResult } from '../lib/scoring';
import { Download, RotateCcw, Users, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [answers, setAnswers] = useState<Record<number, ScoreLevel> | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      // Check for auth user first
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // If user is authenticated, try to load from database
      if (user) {
        const { data: dbResults } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (dbResults && dbResults.length > 0) {
          const result = dbResults[0];
          setAnswers(result.answers as Record<number, ScoreLevel>);
          setResults({
            categories: result.category_scores as any,
            profile: result.profile as any,
            overallPercent: result.overall_percent
          });
          return;
        }
      }

      // Check localStorage for answers (for both auth and non-auth users)
      const savedAnswers = localStorage.getItem('funding-readiness-answers');
      
      if (!savedAnswers) {
        navigate('/checklist');
        return;
      }

      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        const calculatedResults = calculateResults(parsedAnswers);
        
        // If user is authenticated, save to database
        if (user) {
          await supabase
            .from('assessment_results')
            .insert({
              user_id: user.id,
              answers: parsedAnswers as any,
              category_scores: calculatedResults.categories as any,
              profile: calculatedResults.profile,
              overall_percent: calculatedResults.overallPercent
            });
          
          // Clear localStorage after saving to database
          localStorage.removeItem('funding-readiness-answers');
        }
        
        setAnswers(parsedAnswers);
        setResults(calculatedResults);
        
      } catch (error) {
        console.error('Error loading results:', error);
        toast.error('Error loading results. Please try the assessment again.');
        navigate('/checklist');
      }
    };

    loadResults();
  }, [navigate]);

  const handleExportPDF = async () => {
    // Always redirect to email capture for PDF download
    // Store PDF request intent in sessionStorage
    sessionStorage.setItem('requestPDF', 'true');
    navigate('/email-capture');
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear your current results.')) {
      localStorage.removeItem('funding-readiness-answers');
      localStorage.removeItem('funding-readiness-results');
      navigate('/checklist');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('funding-readiness-answers');
    localStorage.removeItem('funding-readiness-results');
    navigate('/');
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Funding Readiness Snapshot
              </h1>
              <p className="text-muted-foreground">
                Here's how your program scores across four key areas, plus your personalized profile and next steps.
              </p>
              {user && (
                <p className="text-sm text-muted-foreground mt-2">
                  Signed in as: {user.email}
                </p>
              )}
            </div>
            {user && (
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Scores */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                Category Scores
              </h2>
              
              <div className="space-y-6">
                {results.categories.map((category, index) => (
                  <BarMeter
                    key={index}
                    label={category.name}
                    percent={category.percent}
                    band={category.band}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-card-foreground">Overall Readiness</span>
                  <span className="text-2xl font-bold text-primary">
                    {results.overallPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Export & Next Steps
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleExportPDF} 
                  disabled={isLoadingPDF}
                  className="flex items-center space-x-2"
                >
                  {isLoadingPDF ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isLoadingPDF ? 'Generating PDF...' : 'Download Results (PDF)'}</span>
                </Button>
                
                <Button variant="outline" onClick={handleStartOver} className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Start Over</span>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-3">
                {user ? 
                  'Download your PDF results and get redirected to learn about our funding workshop.' :
                  'Sign in with your email to download PDF results and learn about our funding workshop.'
                }
              </p>
            </div>

            {/* Workshop CTA */}
            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                Ready to Take Action?
              </h3>
              <p className="text-muted-foreground mb-4">
                Turn your assessment insights into a fundable package with our intensive 4-session workshop.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/workshop-signup')}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Learn About Workshop</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('mailto:hello@fundingreadyworkshop.com?subject=Workshop Questions', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <span>Contact Us</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard profile={results.profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
