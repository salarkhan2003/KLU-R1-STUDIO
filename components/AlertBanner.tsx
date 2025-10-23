
import React from 'react';
import { Alert } from '../types';

interface AlertBannerProps {
  alert: Alert | null;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert }) => {
  if (!alert) return null;

  const bgColor = alert.type === 'ERROR' ? 'bg-spacex-red/80 border-red-500' : 'bg-yellow-600/80 border-yellow-500';

  return (
    <div className={`w-full p-3 rounded-md border text-white font-medium text-center ${bgColor} animate-subtlePulse`}>
      {alert.message}
    </div>
  );
};