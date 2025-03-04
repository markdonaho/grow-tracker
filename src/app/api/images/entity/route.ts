// src/app/api/images/entity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getImagesForEntity, getImageUrlsById } from '@/lib/db/images';
import { EntityType } from '@/types/image';

/**
 * GET /api/images/entity - Get all images for an entity
 * Required query parameters:
 * - entityType: 'Plant' | 'Action'
 * - entityId: string
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType') as EntityType | null;
    const entityId = searchParams.get('entityId');
    
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing entityType or entityId parameters' },
        { status: 400 }
      );
    }
    
    // Only accept valid entity types
    if (!['Plant', 'Action'].includes(entityType)) {
      return NextResponse.json(
        { error: 'Invalid entityType. Must be Plant or Action' },
        { status: 400 }
      );
    }
    
    // Get all images for the entity
    const images = await getImagesForEntity(entityType, entityId);
    
    // Get URLs for all images
    const imageIds = images.map(img => img._id!.toString());
    const imageUrls = await getImageUrlsById(imageIds);
    
    // Combine metadata with URLs
    const imagesWithUrls = images.map(img => {
      const id = img._id!.toString();
      return {
        ...img,
        url: imageUrls[id] || null
      };
    });
    
    return NextResponse.json(imagesWithUrls);
  } catch (error) {
    console.error('Error getting entity images:', error);
    return NextResponse.json(
      { error: 'Failed to get entity images' },
      { status: 500 }
    );
  }
}