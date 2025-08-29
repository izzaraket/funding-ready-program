
import React from 'react';
import type { Band } from '../lib/scoring';
import BandChip from './BandChip';

interface BarMeterProps {
  label: string;
  percent: number;
  band: Band;
}

const BarMeter: React.FC<BarMeterProps> = ({ label, percent, band }) => {
  const barClasses = {
    'High': 'bar-high',
    'Medium': 'bar-medium',
    'Low': 'bar-low'
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <div className="flex items-center space-x-3">
          <span className="text-lg font-semibold text-gray-900">{percent}%</span>
          <BandChip band={band} />
        </div>
      </div>
      
      <div className="bar-meter">
        <div 
          className={`bar-fill ${barClasses[band]}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${percent}% (${band})`}
        />
      </div>
    </div>
  );
};

export default BarMeter;
