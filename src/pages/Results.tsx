
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BarMeter from '../components/BarMeter';
import ProfileCard from '../components/ProfileCard';
import { calculateResults } from '../lib/scoring';
import type { ScoreLevel, AssessmentResult } from '../lib/scoring';
import { Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [answers, setAnswers] = useState<Record<number, ScoreLevel> | null>(null);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('funding-readiness-results');
    
    if (!savedAnswers) {
      // No results data, redirect to checklist
      navigate('/checklist');
      return;
    }

    try {
      const parsedAnswers = JSON.parse(savedAnswers);
      const calculatedResults = calculateResults(parsedAnswers);
      
      setAnswers(parsedAnswers);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Error loading results. Please try the assessment again.');
      navigate('/checklist');
    }
  }, [navigate]);

  const handleExport = () => {
    if (!results || !answers) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      answers,
      results: {
        categories: results.categories,
        profile: results.profile,
        overallPercent: results.overallPercent
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funding-readiness-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded successfully!');
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear your current results.')) {
      localStorage.removeItem('funding-readiness-answers');
      localStorage.removeItem('funding-readiness-results');
      navigate('/checklist');
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Funding Readiness Snapshot
          </h1>
          <p className="text-gray-600">
            Here's how your program scores across four key areas, plus your personalized profile and next steps.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Scores */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
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

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Overall Readiness</span>
                  <span className="text-2xl font-bold text-primary">
                    {results.overallPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What's Next?
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleExport} className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Results (JSON)</span>
                </Button>
                
                <Button variant="outline" onClick={handleStartOver} className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Start Over</span>
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                Export your results to save them locally or share with your team.
              </p>
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
