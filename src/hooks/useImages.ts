// src/hooks/useImages.ts
import useSWR from 'swr';
import { ImageMetadata, EntityType } from '@/types/image';

interface ImageWithUrl extends ImageMetadata {
  url: string;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

/**
 * Hook for fetching images for an entity (Plant or Action)
 */
export function useEntityImages(entityType: EntityType, entityId: string) {
  const { data, error, isLoading, mutate } = useSWR<ImageWithUrl[]>(
    entityId ? `/api/images/entity?entityType=${entityType}&entityId=${entityId}` : null, 
    fetcher
  );
  
  return {
    images: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

/**
 * Hook for fetching a single image by ID
 */
export function useImage(id: string) {
  const { data, error, isLoading, mutate } = useSWR<ImageWithUrl>(
    id ? `/api/images/${id}` : null, 
    fetcher
  );
  
  return {
    image: data,
    isLoading,
    isError: error,
    mutate
  };
}