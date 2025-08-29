
import React from 'react';
import type { Band } from '../lib/scoring';

interface BandChipProps {
  band: Band;
}

const BandChip: React.FC<BandChipProps> = ({ band }) => {
  const baseClasses = "band-chip";
  const bandClasses = {
    'High': 'band-high',
    'Medium': 'band-medium',
    'Low': 'band-low'
  };

  return (
    <span className={`${baseClasses} ${bandClasses[band]}`}>
      {band}
    </span>
  );
};

export default BandChip;
