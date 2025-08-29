import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Video, 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const WorkshopSignup = () => {
  const [showScholarshipForm, setShowScholarshipForm] = useState(false);
  const [scholarshipData, setScholarshipData] = useState({
    orgName: '',
    programSummary: '',
    roadblock: '',
    commitmentConfirmed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScholarshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to apply for a scholarship.');
        return;
      }

      const { error } = await supabase
        .from('scholarship_applications')
        .insert({
          user_id: user.id,
          org_name: scholarshipData.orgName,
          program_summary: scholarshipData.programSummary,
          roadblock: scholarshipData.roadblock,
          commitment_confirmed: scholarshipData.commitmentConfirmed
        });

      if (error) throw error;

      toast.success('Scholarship application submitted! We\'ll review and get back to you soon.');
      setShowScholarshipForm(false);
      
    } catch (error: any) {
      console.error('Error submitting scholarship application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              The Funding-Ready Workshop
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get Your Program Funding‑Ready in 4 Deep‑Dive Sessions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Video Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/uBR6l3cjYZ0"
                  title="Funding-Ready Workshop"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Video className="w-5 h-5" />
                <span>Watch the workshop overview</span>
              </div>
            </Card>

            {/* What's Included */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                What's Included
              </h3>
              <ul className="space-y-3">
                {[
                  'Templates & session materials',
                  'Cohort board access',
                  'Recording access for review',
                  'Completed deliverables (brief, logic model, KPI set)',
                  'Budget + narrative guidance',
                  'Donor plan & story outline'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Registration Options */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-card-foreground">Pricing & Registration</h2>
                </div>
                
                <div className="text-4xl font-bold text-primary mb-2">$2,400</div>
                <p className="text-muted-foreground">per organization (2-3 participants)</p>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Partnership Discount:</strong> Two organizations can team up on a collaborative program and split the costs!
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => window.open('https://yammservices.com/funding-ready-workshop-registration/', '_blank')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Register for Workshop
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => window.open('mailto:hello@fundingreadyworkshop.com?subject=Learn More', '_blank')}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Scholarship Section */}
            <Card className="p-6 border-primary/20">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-card-foreground">Scholarships Available</h3>
                </div>
                
                <Badge variant="secondary" className="mb-4">
                  2 Free Spots Available
                </Badge>
                
                <p className="text-muted-foreground mb-4">
                  We're offering two full scholarships to organizations that demonstrate commitment and need.
                </p>
              </div>

              {!showScholarshipForm ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-card-foreground">Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Attend all four sessions live</li>
                      <li>• Provide feedback when requested</li>
                      <li>• Complete assessment checklist</li>
                    </ul>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('https://yammservices.com/funding-ready-workshop-registration/', '_blank')}
                  >
                    Apply for Free Spot
                    <Star className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleScholarshipSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={scholarshipData.orgName}
                      onChange={(e) => setScholarshipData({...scholarshipData, orgName: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="programSummary">Program Summary (150 words max)</Label>
                    <Textarea
                      id="programSummary"
                      value={scholarshipData.programSummary}
                      onChange={(e) => setScholarshipData({...scholarshipData, programSummary: e.target.value})}
                      maxLength={750}
                      required
                      className="mt-1"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {scholarshipData.programSummary.length}/750 characters
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="roadblock">Current Roadblock</Label>
                    <Textarea
                      id="roadblock"
                      value={scholarshipData.roadblock}
                      onChange={(e) => setScholarshipData({...scholarshipData, roadblock: e.target.value})}
                      required
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="commitment"
                      checked={scholarshipData.commitmentConfirmed}
                      onCheckedChange={(checked) => 
                        setScholarshipData({...scholarshipData, commitmentConfirmed: checked as boolean})
                      }
                    />
                    <Label htmlFor="commitment" className="text-sm">
                      I commit to attending all four sessions live
                    </Label>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowScholarshipForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !scholarshipData.commitmentConfirmed}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>

            {/* Satisfaction Promise */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-card-foreground">Satisfaction Promise</h4>
                  <p className="text-sm text-muted-foreground">
                    If you complete all sessions and don't leave with the listed deliverables, 
                    we'll provide one‑on‑one time to help you finalize versions that work for you.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopSignup;