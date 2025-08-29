
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, TrendingUp, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle,
      title: 'Quick Assessment',
      description: 'Complete in ~3 minutes with our focused 10-question checklist'
    },
    {
      icon: Target,
      title: 'Targeted Results',
      description: 'Get specific scores across four key funding readiness areas'
    },
    {
      icon: TrendingUp,
      title: 'Actionable Insights',
      description: 'Receive practical next steps tailored to your readiness profile'
    },
    {
      icon: Users,
      title: 'No Judgment',
      description: 'Supportive guidance wherever you are in your funding journey'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 animate-fade-in">
            Funding Readiness Checklist
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in">
            Assess one program's funding readiness in ~3 minutes. No right or wrong answers. 
            Get targeted next steps based on your unique situation.
          </p>

          <Button 
            onClick={() => navigate('/checklist')}
            size="lg"
            className="bg-white text-primary hover:bg-gray-50 text-lg px-8 py-4 h-auto animate-fade-in"
          >
            Start the Checklist
          </Button>

          <p className="text-primary-foreground/70 text-sm mt-4 animate-fade-in">
            We won't store your answers unless you choose to
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Nonprofits, By Nonprofit Experts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This tool assesses one <strong>program</strong>—not your whole organization. 
              Get an honest snapshot to guide your funding strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Privacy Matters
          </h3>
          <p className="text-gray-600 mb-6">
            This assessment runs entirely in your browser. We don't collect or store your responses 
            unless you explicitly choose to save your results for later.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <span>No account required</span>
            <span>•</span>
            <span>Data stays local</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
