// src/lib/db/images.ts
import { ObjectId } from 'mongodb';
import { getCollection, COLLECTIONS } from './mongodb';
import { ImageMetadata, EntityType } from '@/types/image';

// Create image metadata
export async function createImageMetadata(imageData: Omit<ImageMetadata, '_id'>) {
  const collection = getCollection(COLLECTIONS.IMAGES);
  const result = await collection.insertOne(imageData as any);
  
  return {
    ...imageData,
    _id: result.insertedId,
  };
}

// Get image metadata by ID
export async function getImageMetadataById(id: string) {
  const collection = getCollection(COLLECTIONS.IMAGES);
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Get all images for an entity
export async function getImagesForEntity(entityType: EntityType, entityId: string) {
  const collection = getCollection(COLLECTIONS.IMAGES);
  return await collection.find({
    entityType,
    entityId: new ObjectId(entityId)
  }).toArray();
}

// Delete image metadata
export async function deleteImageMetadata(id: string) {
  const collection = getCollection(COLLECTIONS.IMAGES);
  await collection.deleteOne({ _id: new ObjectId(id) });
  return { id };
}