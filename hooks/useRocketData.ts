
import { useReducer, useEffect } from 'react';
import { RocketState, Action, FlightStatus, TelemetryDataPoint, LogEntry, Alert } from '../types';

const initialState: RocketState = {
  status: FlightStatus.STANDBY,
  armed: false,
  flightTime: 0,
  telemetry: [{ time: 0, altitude: 0, speed: 0, acceleration: 0, thrust: 0, latitude: 34.0522, longitude: -118.2437 }],
  logs: [],
  alert: null,
};

const MAX_TELEMETRY_POINTS = 100;

const addLog = (logs: LogEntry[], message: string, type: 'INFO' | 'WARNING' | 'ERROR'): LogEntry[] => {
  const newLog: LogEntry = {
    time: new Date().toLocaleTimeString(),
    message,
    type,
  };
  return [newLog, ...logs].slice(0, 50); // Keep logs to a reasonable size
};

const reducer = (state: RocketState, action: Action): RocketState => {
  switch (action.type) {
    case 'ARM':
      if (state.status === FlightStatus.STANDBY) {
        return {
          ...state,
          armed: true,
          status: FlightStatus.ARMED,
          logs: addLog(state.logs, 'System armed. Ready for launch.', 'INFO'),
        };
      }
      return state;
    case 'DISARM':
      return {
        ...state,
        armed: false,
        status: FlightStatus.STANDBY,
        logs: addLog(state.logs, 'System disarmed.', 'INFO'),
      };
    case 'LAUNCH':
      if (state.armed) {
        return {
          ...state,
          status: FlightStatus.COUNTDOWN,
          flightTime: -10, // Start a 10-second countdown
          logs: addLog(state.logs, 'Launch sequence initiated. T-10 seconds.', 'WARNING'),
        };
      }
      return state;
    case 'ABORT':
      return {
        ...initialState,
        status: FlightStatus.ABORTED,
        logs: addLog(state.logs, 'LAUNCH ABORTED BY USER.', 'ERROR'),
        alert: { message: 'Launch Aborted!', type: 'ERROR' },
      };
    case 'UPDATE_TICK': {
      const timeIncrement = action.payload;
      let newState = { ...state, flightTime: state.flightTime + timeIncrement };

      // Countdown logic
      if (newState.status === FlightStatus.COUNTDOWN) {
        if (newState.flightTime >= 0) {
          newState.status = FlightStatus.LIFTOFF;
          newState.logs = addLog(newState.logs, 'Liftoff!', 'INFO');
          newState.flightTime = 0; // Reset flight time at liftoff
        } else {
            const secondsLeft = Math.abs(Math.ceil(newState.flightTime));
            if(Math.ceil(state.flightTime) < Math.ceil(newState.flightTime)) {
                newState.logs = addLog(newState.logs, `T-${secondsLeft}...`, 'INFO');
            }
          return newState;
        }
      }
      
      if (newState.flightTime < 0) return newState; // Still in countdown

      const lastPoint = newState.telemetry[newState.telemetry.length - 1];
      let newPoint: TelemetryDataPoint = { ...lastPoint, time: lastPoint.time + timeIncrement };

      switch (newState.status) {
        case FlightStatus.LIFTOFF:
        case FlightStatus.IN_FLIGHT: {
          const burnTime = 8; // seconds
          if (newState.flightTime > burnTime) {
            newState.status = FlightStatus.APOGEE; // simplified transition
            newPoint.thrust = 0;
            newPoint.acceleration = -9.81;
          } else {
            newState.status = FlightStatus.IN_FLIGHT;
            newPoint.thrust = 7000 * (1 - newState.flightTime / burnTime) + Math.random() * 100;
            newPoint.acceleration = newPoint.thrust / 150 - 9.81; // F=ma, m=150kg
          }
          
          newPoint.speed = Math.max(0, lastPoint.speed + lastPoint.acceleration * timeIncrement);
          newPoint.altitude = Math.max(0, lastPoint.altitude + lastPoint.speed * timeIncrement);
          
          // Simulate GPS coordinate change
          newPoint.latitude = lastPoint.latitude + (newPoint.speed / 500000) * (Math.sin(newState.flightTime));
          newPoint.longitude = lastPoint.longitude + (newPoint.speed / 500000) * (Math.cos(newState.flightTime));

          if(newState.status === FlightStatus.APOGEE && newPoint.speed < 1 && newPoint.altitude > 100){
             newState.logs = addLog(newState.logs, `Apogee reached at ${newPoint.altitude.toFixed(0)}m.`, 'INFO');
             newState.status = FlightStatus.DESCENT;
          }

          break;
        }
        case FlightStatus.APOGEE: // Coasting phase
        case FlightStatus.DESCENT: {
          newPoint.thrust = 0;
          newPoint.acceleration = -9.81; // Gravity
          newPoint.speed = lastPoint.speed + newPoint.acceleration * timeIncrement;
          newPoint.altitude = Math.max(0, lastPoint.altitude + lastPoint.speed * timeIncrement);

           // Simulate GPS coordinate change
          newPoint.latitude = lastPoint.latitude + (newPoint.speed / 500000) * (Math.sin(newState.flightTime));
          newPoint.longitude = lastPoint.longitude + (newPoint.speed / 500000) * (Math.cos(newState.flightTime));

          if (newPoint.altitude <= 0) {
            newState.status = FlightStatus.LANDED;
            newPoint.altitude = 0;
            newPoint.speed = 0;
            newPoint.acceleration = 0;
            newState.logs = addLog(newState.logs, 'Touchdown. Mission complete.', 'INFO');
            newState.alert = { message: 'Rocket has landed safely.', type: 'WARNING' };
          }
          break;
        }
      }
      
      if (newState.status !== FlightStatus.STANDBY && newState.status !== FlightStatus.ARMED && newState.status !== FlightStatus.LANDED && newState.status !== FlightStatus.ABORTED) {
        newState.telemetry = [...newState.telemetry, newPoint].slice(-MAX_TELEMETRY_POINTS);
      }
      
      return newState;
    }
    case 'SET_ALERT':
      return { ...state, alert: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const useRocketData = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const tickInterval = 100; // ms
    const intervalId = setInterval(() => {
      dispatch({ type: 'UPDATE_TICK', payload: tickInterval / 1000 });
    }, tickInterval);

    return () => clearInterval(intervalId);
  }, []);

  return { state, dispatch };
};
