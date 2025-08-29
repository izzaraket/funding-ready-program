
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-green-800 mb-2">The Short Version</h2>
            <p className="text-green-700">
              We don't collect or store your assessment answers by default. Everything happens in your browser. 
              You're in complete control of your data.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Your assessment answers are stored temporarily in your browser's local storage</li>
              <li>• We track basic usage analytics (page views, completion rates) without personal information</li>
              <li>• We use this data to improve the tool's effectiveness</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Don't Do</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• We don't collect personal information like names, emails, or organization details</li>
              <li>• We don't store your specific assessment answers on our servers</li>
              <li>• We don't share your data with third parties</li>
              <li>• We don't use tracking cookies or similar technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Control</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Local Storage:</strong> Your answers are saved in your browser to prevent loss if you refresh the page. 
                You can clear this data anytime by using the "Reset" button or clearing your browser data.
              </p>
              
              <p>
                <strong>Export Feature:</strong> When you export your results, the file is downloaded directly to your device. 
                We don't receive a copy of this data.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Future Features</h2>
            <p className="text-gray-700">
              In future versions, we may offer optional features like saving results to an account or emailing results. 
              These features will always be opt-in, and we'll clearly explain what data we collect and why.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700">
              This tool is designed to be as privacy-friendly as possible while still being useful. 
              If you have questions about how your data is handled, please don't hesitate to reach out.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
