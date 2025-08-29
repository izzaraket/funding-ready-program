
import React from 'react';
import type { ProfileKey } from '../lib/scoring';
import { PROFILE_COPY, IN_A_NUTSHELL } from '../lib/copy';

interface ProfileCardProps {
  profile: ProfileKey;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const profileInfo = PROFILE_COPY[profile];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Your Profile: {profile}
        </h3>
        <p className="text-gray-600 text-lg">{profileInfo.tagline}</p>
      </div>

      <div className="bg-primary/5 rounded-lg p-4">
        <h4 className="font-semibold text-primary mb-2">Next Step</h4>
        <p className="text-gray-700">{profileInfo.nextStep}</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Your Strengths & Focus Areas</h4>
        <ul className="space-y-2">
          {profileInfo.details.map((detail, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-gray-700">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">In a Nutshell</h4>
        <ul className="space-y-1">
          {IN_A_NUTSHELL.map((point, index) => (
            <li key={index} className="text-amber-700 text-sm">
              • {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
