// src/components/plants/plant-metrics.tsx
'use client';

import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGrowthMetrics } from '@/hooks/useGrowthMetrics';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface PlantMetricsProps {
  plantId: string;
}

const PlantMetrics: FC<PlantMetricsProps> = ({ plantId }) => {
  const { metrics, isLoading, isError } = useGrowthMetrics(plantId);
  
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p>Error loading growth metrics. Please try again.</p>
      </div>
    );
  }
  
  if (metrics.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No growth data recorded yet.</p>
      </div>
    );
  }

  // Format data for the chart
  const formattedData = metrics.map(item => ({
    ...item,
    date: new Date(item.date),
    formattedDate: format(new Date(item.date), 'MMM d')
  }));
  
  // Sort by date
  formattedData.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            unit="cm" 
            tick={{ fontSize: 12 }}
          />
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