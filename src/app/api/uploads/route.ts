// src/app/api/uploads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage/minio';
import { createImageMetadata } from '@/lib/db/images';
import { EntityType } from '@/types/image';

// POST /api/uploads - Upload an image
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
    const entityType = formData.get('entityType') as EntityType;
    const entityId = formData.get('entityId') as string;
    
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing entityType or entityId' },
        { status: 400 }
      );
    }
    
    // Generate a unique key for the file
    const key = storageService.generateFileKey(
      entityType,
      entityId,
      file.name
    );
    
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // For Phase 1, we'll just log the upload (using mock storage service)
    await storageService.uploadFile(buffer, key, file.type);
    
    // In Phase 2, we'll uncomment this to save image metadata to MongoDB
    // const imageMetadata = await createImageMetadata({
    //   s3Key: key,
    //   filename: file.name,
    //   contentType: file.type,
    //   size: file.size,
    //   entityType,
    //   entityId: new ObjectId(entityId),
    //   uploadDate: new Date(),
    // });
    
    // For now, return a mock image metadata object
    const mockImageMetadata = {
      _id: `mock-${Date.now()}`,
      s3Key: key,
      filename: file.name,
      contentType: file.type,
      size: file.size,
      entityType,
      entityId,
      uploadDate: new Date(),
      url: `/api/mock-image/${key}`,
    };
    
    return NextResponse.json(mockImageMetadata, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET /api/uploads/:key - Get a file (for development preview)
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // In a real app, we would check for the key in the URL path
    // But since this is a mock for Phase 1, we'll just return a 404
    
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
    
    // In Phase 2, we would implement this to get a presigned URL:
    // const key = params.key;
    // const url = await storageService.getPresignedUrl(key);
    // return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
}