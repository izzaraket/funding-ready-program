
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProgressPill from '../components/ProgressPill';
import QuestionCard from '../components/QuestionCard';
import { ASSESSMENT_QUESTIONS } from '../lib/copy';
import type { ScoreLevel } from '../lib/scoring';
import { toast } from 'sonner';

const Checklist = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, ScoreLevel>>({});

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('funding-readiness-answers');
    if (saved) {
      try {
        const parsedAnswers = JSON.parse(saved);
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever answers change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('funding-readiness-answers', JSON.stringify(answers));
    }
  }, [answers]);

  const handleAnswerSelect = (questionId: number, value: ScoreLevel) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    
    if (answeredCount < 10) {
      toast.error('Please answer all ten questions before viewing results.');
      
      // Focus on first unanswered question
      const firstUnanswered = ASSESSMENT_QUESTIONS.find(q => !answers[q.id]);
      if (firstUnanswered) {
        const element = document.getElementById(`question-${firstUnanswered.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Store answers for results page
    localStorage.setItem('funding-readiness-results', JSON.stringify(answers));
    navigate('/results');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? This will clear all your answers.')) {
      setAnswers({});
      localStorage.removeItem('funding-readiness-answers');
      localStorage.removeItem('funding-readiness-results');
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen assessment-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Funding Readiness Assessment
            </h1>
            <ProgressPill current={answeredCount} total={10} />
          </div>
          
          <p className="text-gray-600 mt-2">
            This tool assesses one <strong>program</strong>—not your whole organization. 
            There are no right or wrong answers.
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {ASSESSMENT_QUESTIONS.map((question) => (
            <div key={question.id} id={`question-${question.id}`}>
              <QuestionCard
                question={question.question}
                options={question.options}
                selectedValue={answers[question.id]}
                onSelect={(value) => handleAnswerSelect(question.id, value as ScoreLevel)}
                questionNumber={question.id}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 mt-12 -mx-4 px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="text-gray-600"
            >
              Reset
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {answeredCount}/10 questions answered
              </span>
              <Button 
                onClick={handleSubmit}
                disabled={answeredCount < 10}
                size="lg"
              >
                View Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
