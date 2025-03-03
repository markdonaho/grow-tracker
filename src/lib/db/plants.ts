// src/lib/db/plants.ts
import { ObjectId } from 'mongodb';
import { getCollection, COLLECTIONS } from './mongodb';
import { Plant, GrowthMetric } from '@/types/plant';

// Get all plants with optional filtering
export async function getPlants(filter: Partial<Plant> = {}) {
  const collection = getCollection(COLLECTIONS.PLANTS);
  return await collection.find(filter).sort({ updatedAt: -1 }).toArray();
}

// Get a single plant by ID
export async function getPlantById(id: string) {
  const collection = getCollection(COLLECTIONS.PLANTS);
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Create a new plant
export async function createPlant(plantData: Omit<Plant, '_id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  const newPlant: Plant = {
    ...plantData,
    createdAt: now,
    updatedAt: now,
  };
  
  const collection = getCollection(COLLECTIONS.PLANTS);
  const result = await collection.insertOne(newPlant as any);
  
  return {
    ...newPlant,
    _id: result.insertedId,
  };
}

// Update an existing plant
export async function updatePlant(id: string, plantData: Partial<Plant>) {
  const collection = getCollection(COLLECTIONS.PLANTS);
  
  const updateData = {
    ...plantData,
    updatedAt: new Date(),
  };
  
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  
  return await getPlantById(id);
}

// Delete a plant
export async function deletePlant(id: string) {
  const collection = getCollection(COLLECTIONS.PLANTS);
  await collection.deleteOne({ _id: new ObjectId(id) });
  return { id };
}

// Add a growth metric to a plant
export async function addGrowthMetric(plantId: string, metricData: Omit<GrowthMetric, 'id'>) {
  const collection = getCollection(COLLECTIONS.PLANTS);
  
  await collection.updateOne(
    { _id: new ObjectId(plantId) },
    { 
      $push: { growthMetrics: metricData as any },
      $set: { updatedAt: new Date() }
    }
  );
  
  return await getPlantById(plantId);
}