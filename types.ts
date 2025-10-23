
export enum FlightStatus {
  STANDBY = "STANDBY",
  ARMED = "ARMED",
  COUNTDOWN = "COUNTDOWN",
  LIFTOFF = "LIFTOFF",
  IN_FLIGHT = "IN_FLIGHT",
  APOGEE = "APOGEE",
  DESCENT = "DESCENT",
  LANDED = "LANDED",
  ABORTED = "ABORTED",
}

export interface TelemetryDataPoint {
  time: number;
  altitude: number;
  speed: number;
  acceleration: number;
  thrust: number;
  latitude: number;
  longitude: number;
}

export interface LogEntry {
  time: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
}

export interface Alert {
  message: string;
  type: 'WARNING' | 'ERROR';
}

export interface RocketState {
  status: FlightStatus;
  armed: boolean;
  flightTime: number;
  telemetry: TelemetryDataPoint[];
  logs: LogEntry[];
  alert: Alert | null;
}

export type Action =
  | { type: 'ARM' }
  | { type: 'DISARM' }
  | { type: 'LAUNCH' }
  | { type: 'ABORT' }
  | { type: 'RESET' }
  | { type: 'UPDATE_TICK'; payload: number }
  | { type: 'SET_ALERT'; payload: Alert | null };