
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
  const [showFullResults, setShowFullResults] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      // Check for auth user first
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Check if they've already provided email (returned from email capture)
      const hasProvidedEmail = sessionStorage.getItem('emailProvided');
      if (hasProvidedEmail === 'true') {
        setShowFullResults(true);
        sessionStorage.removeItem('emailProvided');
      }

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
          const computedResults = {
            categories: result.category_scores as any,
            profile: result.profile as any,
            overallPercent: result.overall_percent
          };
          setResults(computedResults);
          // Persist for PDF flow
          localStorage.setItem('funding-readiness-results', JSON.stringify(computedResults));
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
        // Persist results locally for PDF flow
        localStorage.setItem('funding-readiness-results', JSON.stringify(calculatedResults));
        
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
            {!showFullResults && (
              <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  📧 Get Your Full Results
                </h3>
                <p className="text-muted-foreground mb-4">
                  Enter your email to unlock detailed feedback, funder perspective, personalized recommendations, and download your comprehensive PDF report.
                </p>
                
                <Button 
                  onClick={handleExportPDF}
                  size="lg"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Get Full Results & PDF
                </Button>
              </div>
            )}

            {showFullResults && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Actions
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={handleStartOver} className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Start Over</span>
                  </Button>
                </div>
              </div>
            )}

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
                  onClick={() => window.open('https://yammservices.com/funding-ready-program/', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Learn About Workshop</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://yammservices.com/contact/', '_blank')}
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
            <ProfileCard profile={results.profile} summaryOnly={!showFullResults} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
