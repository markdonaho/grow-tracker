// src/components/plants/plant-metrics.tsx
'use client';

import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlantMetricsProps {
  plantId: string;
}

const PlantMetrics: FC<PlantMetricsProps> = ({ plantId }) => {
  // Mock data - in a real app, this would come from your API
  const mockGrowthData = [
    { date: '2024-11-09', height: 5 },
    { date: '2024-11-16', height: 8 },
    { date: '2024-11-23', height: 12 },
    { date: '2024-11-30', height: 15 },
    { date: '2024-12-07', height: 18 },
    { date: '2024-12-14', height: 20 },
    { date: '2024-12-21', height: 22 },
    { date: '2024-12-28', height: 23 },
    { date: '2025-01-04', height: 24 },
    { date: '2025-01-11', height: 24 },
    { date: '2025-01-18', height: 24 },
    { date: '2025-01-25', height: 24 },
    { date: '2025-02-01', height: 24 },
  ];

  // Format date for display
  const formattedData = mockGrowthData.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis unit="cm" />
          <Tooltip 
            formatter={(value) => [`${value} cm`, 'Height']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="height"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlantMetrics;