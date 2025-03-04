// src/hooks/usePlants.ts
import useSWR from 'swr';
import { Plant } from '@/types/plant';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

/**
 * Hook for fetching all plants or active plants
 */
export function usePlants(activeOnly: boolean = false) {
  const url = activeOnly 
    ? '/api/plants?active=true' 
    : '/api/plants';
  
  const { data, error, isLoading, mutate } = useSWR<Plant[]>(url, fetcher);
  
  return {
    plants: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

/**
 * Hook for fetching a single plant by ID
 */
export function usePlant(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Plant>(
    id ? `/api/plants/${id}` : null, 
    fetcher
  );
  
  return {
    plant: data,
    isLoading,
    isError: error,
    mutate
  };
}