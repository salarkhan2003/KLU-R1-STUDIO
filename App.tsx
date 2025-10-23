
import React, { useState } from 'react';
import { Header } from './components/Header';
import { TelemetryChart } from './components/TelemetryChart';
import { StatusIndicator } from './components/StatusIndicator';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';
import { RocketVisualization } from './components/RocketVisualization';
import { MapPanel } from './components/MapPanel';
import { AlertBanner } from './components/AlertBanner';
import { ConfirmationModal } from './components/ConfirmationModal';
import { useRocketData } from './hooks/useRocketData';
import { useCountdownAudio } from './hooks/useCountdownAudio';

const App: React.FC = () => {
  const { state, dispatch } = useRocketData();
  const [isArmModalOpen, setIsArmModalOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const { isReady: isAudioReady, isPrepping: isAudioPrepping } = useCountdownAudio();

  const handleArm = () => {
    if (state.armed) {
      dispatch({ type: 'DISARM' });
    } else {
      setIsArmModalOpen(true);
    }
  };

  const confirmArm = () => {
    dispatch({ type: 'ARM' });
    setIsArmModalOpen(false);
  };
  
  const handleLaunch = () => {
    setIsLaunchModalOpen(true);
  };
  
  const confirmLaunch = () => {
    dispatch({ type: 'LAUNCH' });
    setIsLaunchModalOpen(false);
  };

  const handleAbort = () => {
    dispatch({ type: 'ABORT' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handleExportData = () => {
    if (state.telemetry.length <= 1) {
      console.log("No flight data to export.");
      return;
    }

    const headers = Object.keys(state.telemetry[0]).join(',');
    const rows = state.telemetry.map(point =>
      Object.values(point).map(value =>
        typeof value === 'number' ? value.toFixed(4) : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `klu-r1-flight-data-${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const telemetryData = state.telemetry;
  const lastTelemetry = telemetryData.length > 0 ? telemetryData[telemetryData.length - 1] : { altitude: 0, speed: 0, acceleration: 0, thrust: 0, time: 0, latitude: 34.0522, longitude: -118.2437 };

  return (
    <div className="min-h-screen bg-spacex-bg text-gray-200 font-sans p-4 space-y-4">
      <AlertBanner alert={state.alert} />
      <Header status={state.status} armed={state.armed} flightTime={state.flightTime} />
      
      <main className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4">
          <ControlPanel
            status={state.status}
            armed={state.armed}
            onArm={handleArm}
            onLaunch={handleLaunch}
            onAbort={handleAbort}
            onReset={handleReset}
            onExportData={handleExportData}
            isAudioReady={isAudioReady}
            isAudioPrepping={isAudioPrepping}
          />
          <RocketVisualization status={state.status} altitude={lastTelemetry.altitude} />
          <MapPanel latitude={lastTelemetry.latitude} longitude={lastTelemetry.longitude} />
        </div>

        {/* Center Column */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatusIndicator label="Altitude" value={lastTelemetry.altitude.toFixed(0)} unit="m" />
            <StatusIndicator label="Speed" value={lastTelemetry.speed.toFixed(0)} unit="m/s" />
            <StatusIndicator label="Thrust" value={lastTelemetry.thrust.toFixed(0)} unit="N" />
            <StatusIndicator label="Acceleration" value={lastTelemetry.acceleration.toFixed(1)} unit="m/s²" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[400px]">
            <TelemetryChart data={telemetryData} dataKey="altitude" name="Altitude" color="#60a5fa" />
            <TelemetryChart data={telemetryData} dataKey="speed" name="Speed" color="#4ade80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[400px]">
            <TelemetryChart data={telemetryData} dataKey="thrust" name="Thrust" color="#f87171" />
            <TelemetryChart data={telemetryData} dataKey="acceleration" name="Acceleration" color="#facc15" />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 xl:col-span-1 lg:order-last">
          <LogPanel logs={state.logs} />
        </div>
      </main>

      <ConfirmationModal
        isOpen={isArmModalOpen}
        onClose={() => setIsArmModalOpen(false)}
        onConfirm={confirmArm}
        title="Confirm Arming Sequence"
      >
        <p className="text-gray-300">
          You are about to arm the ignition system. This is the final step before launch readiness. Ensure all safety checks are complete.
        </p>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        onConfirm={confirmLaunch}
        title="CONFIRM LAUNCH"
        confirmText="IGNITE"
        isDestructive={true}
      >
        <p className="text-gray-300">
          This action is irreversible. Initiating launch sequence. T-minus 10 seconds will begin immediately upon confirmation.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default App;