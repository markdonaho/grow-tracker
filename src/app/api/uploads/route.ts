// src/app/api/uploads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, getImageUrl } from '@/lib/db/images';
import { EntityType } from '@/types/image';

/**
 * POST /api/uploads - Upload an image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get the file from form data
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Get metadata from form data
    const entityType = formData.get('entityType') as EntityType | null;
    const entityId = formData.get('entityId') as string | null;
    
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing entityType or entityId' },
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
    
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload the image
    const imageMetadata = await uploadImage(
      buffer,
      file.name,
      file.type,
      entityType,
      entityId
    );
    
    // Get a URL for the newly uploaded image
    const url = await getImageUrl(imageMetadata._id?.toString() || '');
    
    // Return metadata with URL
    return NextResponse.json(
      {
        ...imageMetadata,
        url
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}