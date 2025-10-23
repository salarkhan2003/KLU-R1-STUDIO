
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const getLogColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'INFO':
      return 'text-gray-400';
    case 'WARNING':
      return 'text-yellow-400';
    case 'ERROR':
      return 'text-spacex-red';
    default:
      return 'text-gray-500';
  }
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = 0;
        }
    }, [logs]);

  return (
    <div className="bg-spacex-card border border-spacex-border p-4 rounded-md h-[400px] lg:h-full flex flex-col">
      <h2 className="text-lg font-medium text-gray-300 mb-2 flex-shrink-0 uppercase">System Logs</h2>
      <div ref={logContainerRef} className="flex-grow overflow-y-auto font-mono text-sm space-y-1 pr-2">
        {logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 mr-2 flex-shrink-0">{log.time}</span>
            <span className={getLogColor(log.type)}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};