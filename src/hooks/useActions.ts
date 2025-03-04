// src/hooks/useActions.ts
import useSWR from 'swr';
import { Action } from '@/types/action';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

/**
 * Hook for fetching all recent actions
 */
export function useRecentActions(limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR<Action[]>(
    `/api/actions?limit=${limit}`, 
    fetcher
  );
  
  return {
    actions: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

/**
 * Hook for fetching actions for a specific plant
 */
export function usePlantActions(plantId: string) {
  const { data, error, isLoading, mutate } = useSWR<Action[]>(
    plantId ? `/api/actions?plantId=${plantId}` : null, 
    fetcher
  );
  
  return {
    actions: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

/**
 * Hook for fetching a single action by ID
 */
export function useAction(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Action>(
    id ? `/api/actions/${id}` : null, 
    fetcher
  );
  
  return {
    action: data,
    isLoading,
    isError: error,
    mutate
  };
}