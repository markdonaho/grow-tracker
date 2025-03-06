// src/lib/db/plants.ts
// import { ObjectId } from 'mongodb';
import { 
  getPlantsCollection, 
  createObjectId, 
  sanitizeDocument, 
  sanitizeDocuments 
} from './mongodb';
import { Plant, GrowthMetric, PlantStatus, GrowCycleType } from '@/types/plant';

/**
 * Get all plants with optional filtering
 */
export async function getPlants(filter: Partial<Plant> = {}): Promise<Plant[]> {
  const collection = await getPlantsCollection();
  const plants = await collection.find(filter).sort({ updatedAt: -1 }).toArray();
  return sanitizeDocuments(plants);
}

/**
 * Get all active plants (Growing status)
 */
export async function getActivePlants(): Promise<Plant[]> {
  return getPlants({ status: 'Growing' as PlantStatus });
}

/**
 * Get a single plant by ID
 */
export async function getPlantById(id: string): Promise<Plant | null> {
  try {
    const collection = await getPlantsCollection();
    const plant = await collection.findOne({ _id: createObjectId(id) });
    return plant ? sanitizeDocument(plant) : null;
  } catch (error) {
    console.error('Error getting plant by ID:', error);
    return null;
  }
}

/**
 * Create a new plant
 */
export async function createPlant(plantData: Omit<Plant, '_id' | 'createdAt' | 'updatedAt'>): Promise<Plant> {
  const now = new Date();
  const newPlant: Omit<Plant, '_id'> = {
    ...plantData,
    createdAt: now,
    updatedAt: now,
  };
  
  const collection = await getPlantsCollection();
  const result = await collection.insertOne(newPlant as Omit<Plant, '_id'>);
  
  return {
    ...newPlant,
    _id: result.insertedId.toString(),
  } as Plant;
}

/**
 * Update an existing plant
 */
export async function updatePlant(id: string, plantData: Partial<Plant>): Promise<Plant | null> {
  try {
    const collection = await getPlantsCollection();
    
    const updateData = {
      ...plantData,
      updatedAt: new Date(),
    };
    
    // Remove _id if present in the update data
    if (updateData._id) {
      delete updateData._id;
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: createObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result ? sanitizeDocument(result) : null;
  } catch (error) {
    console.error('Error updating plant:', error);
    return null;
  }
}

/**
 * Delete a plant
 */
export async function deletePlant(id: string): Promise<{ id: string } | null> {
  try {
    const collection = await getPlantsCollection();
    const result = await collection.deleteOne({ _id: createObjectId(id) });
    
    if (result.deletedCount === 1) {
      return { id };
    }
    
    return null;
  } catch (error) {
    console.error('Error deleting plant:', error);
    return null;
  }
}

/**
 * Add a growth metric to a plant
 */
export async function addGrowthMetric(plantId: string, metricData: Omit<GrowthMetric, 'id'>): Promise<Plant | null> {
  try {
    const collection = await getPlantsCollection();
    
    const result = await collection.findOneAndUpdate(
      { _id: createObjectId(plantId) },
      { 
        $push: { growthMetrics: metricData },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    return result ? sanitizeDocument(result) : null;
  } catch (error) {
    console.error('Error adding growth metric:', error);
    return null;
  }
}

/**
 * Update a plant's status
 */
export async function updatePlantStatus(id: string, status: PlantStatus): Promise<Plant | null> {
  return updatePlant(id, { status });
}

/**
 * Update a plant's grow cycle type
 */
export async function updatePlantGrowCycle(id: string, growCycleType: GrowCycleType): Promise<Plant | null> {
  return updatePlant(id, { growCycleType });
}

/**
 * Mark a plant as harvested
 */
export async function harvestPlant(id: string, harvestDate: Date = new Date()): Promise<Plant | null> {
  return updatePlant(id, { 
    status: 'Harvested' as PlantStatus, 
    harvestDate 
  });
}

/**
 * Get the latest growth metric for a plant
 */
export async function getLatestGrowthMetric(plantId: string): Promise<GrowthMetric | null> {
  const plant = await getPlantById(plantId);
  
  if (!plant || !plant.growthMetrics || plant.growthMetrics.length === 0) {
    return null;
  }
  
  // Sort by date descending and get the first one
  const sortedMetrics = [...plant.growthMetrics].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return sortedMetrics[0];
}

/**
 * Set a plant's cover image
 */
export async function setPlantCoverImage(plantId: string, imageId: string): Promise<Plant | null> {
  return updatePlant(plantId, { coverImageId: imageId });
}