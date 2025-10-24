
import React from 'react';
import type { ProfileKey } from '../lib/scoring';
import { PROFILE_COPY } from '../lib/copy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ExternalLink } from 'lucide-react';

interface ProfileCardProps {
  profile: ProfileKey;
  summaryOnly?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, summaryOnly = false }) => {
  const profileInfo = PROFILE_COPY[profile];

  if (summaryOnly) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Your Profile: {profile}
          </CardTitle>
          <CardDescription className="text-lg">
            {profileInfo.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Next Step Preview */}
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Next Step</h4>
            <p className="text-gray-700">{profileInfo.nextStep}</p>
          </div>

          {/* Teaser */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Want to see your detailed feedback, funder perspective, resources, and personalized recommendations?
            </p>
            <p className="text-xs text-muted-foreground">
              Enter your email to unlock your full results and get a downloadable PDF.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Your Profile: {profile}
        </CardTitle>
        <CardDescription className="text-lg">
          {profileInfo.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Funder Perspective */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Funder Perspective</h4>
          <p className="text-blue-700">{profileInfo.funderPerspective}</p>
        </div>

        {/* Next Step */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">Next Step</h4>
          <p className="text-gray-700">{profileInfo.nextStep}</p>
        </div>

        {/* Detailed Feedback */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Detailed Feedback</h4>
          <div className="prose prose-sm max-w-none">
            {profileInfo.detailedFeedback.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4 last:mb-0">
                {paragraph.split('\n').map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < paragraph.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>

        {/* In a Nutshell */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">In a Nutshell</h4>
          <ul className="space-y-1">
            {profileInfo.details.map((point, index) => (
              <li key={index} className="text-amber-700 text-sm">
                • {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        {profileInfo.resources && profileInfo.resources.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Resources to Explore</h4>
            <ul className="space-y-2">
              {profileInfo.resources.map((resource, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <ExternalLink className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
