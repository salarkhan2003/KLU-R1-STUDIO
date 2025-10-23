
import React from 'react';
import { FlightStatus } from '../types';

interface HeaderProps {
  status: FlightStatus;
  armed: boolean;
  flightTime: number;
}

const formatTime = (seconds: number) => {
  if (seconds < 0) {
    return `-00:${String(Math.abs(Math.ceil(seconds))).padStart(2, '0')}`;
  }
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const Header: React.FC<HeaderProps> = ({ status, armed, flightTime }) => {
  const statusColor =
    status === FlightStatus.ABORTED ? 'text-spacex-red' :
    status === FlightStatus.IN_FLIGHT || status === FlightStatus.LIFTOFF ? 'text-green-400' :
    armed ? 'text-yellow-400' :
    'text-blue-400';

  return (
    <header className="bg-spacex-card border border-spacex-border p-4 rounded-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path><path d="M12 17.01V22h.01"></path><path d="M12 12.01V17h.01"></path><path d="M12 7.01V12h.01"></path></svg>
        <h1 className="text-xl md:text-2xl font-medium tracking-wider text-gray-100 uppercase">KLU R1 LAUNCH CONTROL</h1>
      </div>
      <div className="flex items-center space-x-4 md:space-x-6 text-right">
        <div className="font-mono text-lg">
          <span className="text-spacex-gray">STATUS: </span>
          <span className={`font-medium ${statusColor}`}>{status}</span>
        </div>
        <div className="font-mono text-lg hidden md:block">
          <span className="text-spacex-gray">ARMED: </span>
          <span className={`font-medium ${armed ? 'text-spacex-red animate-subtlePulse' : 'text-spacex-gray'}`}>{armed ? 'YES' : 'NO'}</span>
        </div>
        <div className="font-mono text-lg bg-black/50 px-3 py-1 rounded">
          <span className="text-spacex-gray">T: </span>
          <span className="font-medium text-gray-200">{formatTime(flightTime)}</span>
        </div>
      </div>
    </header>
  );
};