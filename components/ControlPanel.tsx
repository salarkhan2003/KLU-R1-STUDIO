import React from 'react';
import { FlightStatus } from '../types';

interface ControlPanelProps {
  status: FlightStatus;
  armed: boolean;
  onArm: () => void;
  onLaunch: () => void;
  onAbort: () => void;
  onReset: () => void;
  onExportData: () => void;
  isAudioPrepping: boolean;
  isAudioReady: boolean;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean; className?: string, children: React.ReactNode }> = ({ onClick, disabled, className, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full font-medium py-3 px-4 rounded-md text-md uppercase tracking-wider transition-all duration-200 border
        ${className} 
        ${disabled ? 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
    >
        {children}
    </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ status, armed, onArm, onLaunch, onAbort, onReset, onExportData, isAudioPrepping, isAudioReady }) => {
  const isMissionOver = status === FlightStatus.LANDED || status === FlightStatus.ABORTED;

  if (isMissionOver) {
    return (
        <div className="bg-spacex-card border border-spacex-border p-4 rounded-md space-y-4">
            <h2 className="text-xl font-medium text-center text-gray-300">MISSION END</h2>
            <div className="space-y-2">
                <Button
                    onClick={onReset}
                    className="bg-spacex-blue border-blue-400 text-white"
                >
                    Restart Mission
                </Button>
                <Button
                    onClick={onExportData}
                    className="bg-transparent border-spacex-gray text-spacex-gray hover:bg-spacex-border hover:text-white"
                >
                    Download Flight Data
                </Button>
            </div>
        </div>
    );
  }
  
  const isLaunchReady = armed && status === FlightStatus.ARMED && isAudioReady;
  const armButtonText = armed ? 'Disarm System' : isAudioPrepping ? 'Prepping Audio...' : 'Arm System';
  const isArmDisabled = !(status === FlightStatus.STANDBY || status === FlightStatus.ARMED) || isAudioPrepping;

  return (
    <div className="bg-spacex-card border border-spacex-border p-4 rounded-md space-y-4">
      <h2 className="text-xl font-medium text-center text-gray-300">MISSION CONTROL</h2>
      <Button
        onClick={onArm}
        disabled={isArmDisabled}
        className={armed ? 'bg-yellow-600/80 border-yellow-500 text-white' : 'bg-spacex-blue/80 border-blue-400 text-white'}
      >
        {armButtonText}
      </Button>
      <Button
        onClick={onLaunch}
        disabled={!isLaunchReady}
        className={isLaunchReady ? 'bg-green-600/80 border-green-500 text-white animate-subtlePulse' : ''}
      >
        Launch
      </Button>
      <Button
        onClick={onAbort}
        className="bg-spacex-red/80 border-red-500 text-white"
      >
        Abort
      </Button>
    </div>
  );
};