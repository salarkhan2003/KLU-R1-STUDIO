
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TelemetryDataPoint } from '../types';

interface TelemetryChartProps {
  data: TelemetryDataPoint[];
  dataKey: keyof TelemetryDataPoint;
  name: string;
  color: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ data, dataKey, name, color }) => {
  return (
    <div className="bg-spacex-card border border-spacex-border p-4 rounded-md h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <XAxis 
            dataKey="time" 
            stroke="#8a8a8a" 
            tick={{ fill: '#8a8a8a', fontSize: 12, fontFamily: 'Roboto Mono' }} 
            tickFormatter={(time) => `${time.toFixed(0)}s`}
          />
          <YAxis stroke="#8a8a8a" tick={{ fill: '#8a8a8a', fontSize: 12, fontFamily: 'Roboto Mono' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#121212', border: '1px solid #333333', color: '#eaeaea', fontFamily: 'Roboto Mono' }}
            labelStyle={{ color: '#8a8a8a' }}
            itemStyle={{ fontWeight: 500 }}
          />
          <Legend wrapperStyle={{ color: '#eaeaea', fontFamily: 'Roboto' }} />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            name={name} 
            stroke={color} 
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};