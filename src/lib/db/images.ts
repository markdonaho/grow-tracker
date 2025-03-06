// src/lib/db/images.ts
// import { ObjectId } from 'mongodb';
import { 
  getImagesCollection, 
  createObjectId, 
  sanitizeDocument, 
  sanitizeDocuments 
} from './mongodb';
import { ImageMetadata, EntityType } from '@/types/image';
import { storageService } from '@/lib/storage/minio';

/**
 * Create image metadata
 */
export async function createImageMetadata(
  imageData: Omit<ImageMetadata, '_id'>
): Promise<ImageMetadata> {
  try {
    // Ensure entityId is an ObjectId
    const entityId = typeof imageData.entityId === 'string' 
      ? createObjectId(imageData.entityId) 
      : imageData.entityId;
    
    const metadata = {
      ...imageData,
      entityId,
    };
    
    const collection = await getImagesCollection();
    const result = await collection.insertOne(metadata as Omit<ImageMetadata, '_id'>);
    
    return {
      ...metadata,
      _id: result.insertedId.toString(),
    } as ImageMetadata;
  } catch (error) {
    console.error('Error creating image metadata:', error);
    throw error;
  }
}

/**
 * Get image metadata by ID
 */
export async function getImageMetadataById(id: string): Promise<ImageMetadata | null> {
  try {
    const collection = await getImagesCollection();
    const image = await collection.findOne({ _id: createObjectId(id) });
    
    return image ? sanitizeDocument(image) : null;
  } catch (error) {
    console.error('Error getting image metadata by ID:', error);
    return null;
  }
}

/**
 * Get all images for an entity
 */
export async function getImagesForEntity(
  entityType: EntityType, 
  entityId: string
): Promise<ImageMetadata[]> {
  try {
    const collection = await getImagesCollection();
    const images = await collection.find({
      entityType,
      entityId: createObjectId(entityId)
    }).sort({ uploadDate: -1 }).toArray();
    
    return sanitizeDocuments(images);
  } catch (error) {
    console.error('Error getting images for entity:', error);
    return [];
  }
}

/**
 * Delete image metadata and the actual file
 */
export async function deleteImage(id: string): Promise<{ id: string } | null> {
  try {
    // First, get the metadata to find the storage key
    const imageMetadata = await getImageMetadataById(id);
    
    if (!imageMetadata) {
      return null;
    }
    
    // Delete from storage
    await storageService.deleteFile(imageMetadata.s3Key);
    
    // Delete metadata
    const collection = await getImagesCollection();
    const result = await collection.deleteOne({ _id: createObjectId(id) });
    
    if (result.deletedCount === 1) {
      return { id };
    }
    
    return null;
  } catch (error) {
    console.error('Error deleting image:', error);
    return null;
  }
}

/**
 * Get a presigned URL for an image
 */
export async function getImageUrl(id: string): Promise<string | null> {
  try {
    const imageMetadata = await getImageMetadataById(id);
    
    if (!imageMetadata) {
      return null;
    }
    
    return storageService.getPresignedUrl(imageMetadata.s3Key);
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
}

/**
 * Get multiple image URLs by IDs
 */
export async function getImageUrlsById(
  imageIds: string[]
): Promise<Record<string, string>> {
  try {
    const results: Record<string, string> = {};
    
    for (const id of imageIds) {
      const url = await getImageUrl(id);
      if (url) {
        results[id] = url;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error getting multiple image URLs:', error);
    return {};
  }
}

/**
 * Upload an image and create its metadata
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string,
  entityType: EntityType,
  entityId: string
): Promise<ImageMetadata> {
  try {
    // Generate a unique storage key
    const s3Key = storageService.generateFileKey(entityType, entityId, filename);
    
    // Upload to storage
    await storageService.uploadFile(file, s3Key, contentType);
    
    // Create metadata
    const metadata = await createImageMetadata({
      s3Key,
      filename,
      contentType,
      size: file.length,
      entityType,
      entityId: createObjectId(entityId),
      uploadDate: new Date(),
    });
    
    return metadata;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}