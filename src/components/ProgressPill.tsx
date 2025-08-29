
import React from 'react';

interface ProgressPillProps {
  current: number;
  total: number;
}

const ProgressPill: React.FC<ProgressPillProps> = ({ current, total }) => {
  return (
    <div className="progress-pill">
      <span className="sr-only">Progress: </span>
      {current}/{total} answered
    </div>
  );
};

export default ProgressPill;
