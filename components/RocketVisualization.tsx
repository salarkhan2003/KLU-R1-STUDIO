
import React from 'react';
import { FlightStatus } from '../types';

interface RocketVisualizationProps {
  status: FlightStatus;
  altitude: number;
}

const MAX_VISUAL_ALTITUDE = 1100; // The altitude at which the rocket reaches the top of the container

export const RocketVisualization: React.FC<RocketVisualizationProps> = ({ status, altitude }) => {
  const showFlame = [FlightStatus.LIFTOFF, FlightStatus.IN_FLIGHT].includes(status);
  
  const verticalPosition = 100 - Math.min(100, (altitude / MAX_VISUAL_ALTITUDE) * 100);

  return (
    <div className="bg-spacex-card border border-spacex-border p-4 rounded-md h-96 flex flex-col items-center justify-end overflow-hidden relative">
        {/* Background stars */}
        <div className="absolute inset-0 bg-black">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-1/2 left-3/4 w-px h-px bg-white rounded-full opacity-60"></div>
            <div className="absolute top-2/3 left-1/3 w-px h-px bg-white rounded-full opacity-70"></div>
            <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-white rounded-full opacity-50"></div>
            <div className="absolute top-3/4 left-1/2 w-px h-px bg-white rounded-full opacity-90"></div>
        </div>

      <div 
        className="relative transition-all duration-100 ease-linear"
        style={{ top: `${verticalPosition - 85}%` }} // Adjust offset to start from bottom
      >
        <svg
          width="60"
          height="140"
          viewBox="0 0 60 140"
          className="z-10 relative"
        >
          {/* Main Body */}
          <path d="M20,130 L20,30 L40,30 L40,130 Z" fill="#D1D5DB" />
          {/* Stage Separator */}
          <rect x="18" y="40" width="24" height="2" fill="#4B5563" />
          {/* Nose Cone */}
          <path d="M30,0 L20,30 L40,30 Z" fill="#F9FAFB" />
          {/* Fins */}
          <path d="M20,110 L5,130 L20,130 Z" fill="#9CA3AF" />
          <path d="M40,110 L55,130 L40,130 Z" fill="#9CA3AF" />
          {/* Engine Nozzle */}
          <path d="M22,130 L25,140 L35,140 L38,130 Z" fill="#4B5563" />
        </svg>

        {showFlame && (
           <svg
            width="50"
            height="100"
            viewBox="0 0 50 100"
            className="absolute -bottom-24 left-1/2 -translate-x-1/2"
          >
            <defs>
              <radialGradient id="flameGradient">
                <stop offset="0%" stopColor="#AACCFF" />
                <stop offset="50%" stopColor="#005288" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="animate-rocketFlame origin-bottom">
                <path d="M15,100 C15,70 0,80 0,60 C0,40 15,40 25,0 C35,40 50,40 50,60 C50,80 35,70 35,100 Z" fill="url(#flameGradient)" />
                <path d="M20,100 C20,75 15,80 15,65 C15,50 20,50 25,10 C30,50 35,50 35,65 C35,80 30,75 30,100 Z" fill="#E0F2FE" className="animate-flicker" />
            </g>
          </svg>
        )}
      </div>
      
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-700 border-t-2 border-gray-600"></div>
    </div>
  );
};
