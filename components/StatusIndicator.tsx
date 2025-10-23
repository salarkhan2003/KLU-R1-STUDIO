
import React from 'react';

interface StatusIndicatorProps {
  label: string;
  value: string | number;
  unit: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, value, unit }) => {
  return (
    <div className="bg-spacex-card border border-spacex-border p-4 rounded-md text-center">
      <p className="text-sm text-spacex-gray uppercase tracking-wider font-medium">{label}</p>
      <p className="text-3xl font-mono font-medium text-gray-200 mt-1">
        {value}
        <span className="text-xl text-spacex-gray ml-1">{unit}</span>
      </p>
    </div>
  );
};