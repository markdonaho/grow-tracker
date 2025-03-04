// src/hooks/useGrowthMetrics.ts
import useSWR from 'swr';
import { GrowthMetric } from '@/types/plant';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

/**
 * Hook for fetching growth metrics for a plant
 */
export function useGrowthMetrics(plantId: string) {
  const { data, error, isLoading, mutate } = useSWR<GrowthMetric[]>(
    plantId ? `/api/plants/${plantId}/growth` : null, 
    fetcher
  );
  
  return {
    metrics: data || [],
    isLoading,
    isError: error,
    mutate
  };
}