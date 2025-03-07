import { NextRequest, NextResponse } from 'next/server';
import { getImageMetadataById, getImageUrl, deleteImage } from '@/lib/db/images';

/**
 * GET /api/images/[id] - Get image metadata and URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageMetadata = await getImageMetadataById(id);
    
    if (!imageMetadata) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Get a URL for the image
    const url = await getImageUrl(id);
    
    // Return metadata with URL
    return NextResponse.json({
      ...imageMetadata,
      url
    });
  } catch (error) {
    console.error('Error getting image:', error);
    return NextResponse.json(
      { error: 'Failed to get image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/images/[id] - Delete an image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteImage(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
