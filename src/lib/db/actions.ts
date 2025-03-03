// src/lib/db/actions.ts
import { ObjectId } from 'mongodb';
import { getCollection, COLLECTIONS } from './mongodb';
import { Action } from '@/types/action';

// Get actions for a specific plant
export async function getActionsForPlant(plantId: string) {
  const collection = getCollection(COLLECTIONS.ACTIONS);
  return await collection.find({ 
    plantId: new ObjectId(plantId) 
  }).sort({ date: -1 }).toArray();
}

// Get all recent actions
export async function getRecentActions(limit = 10) {
  const collection = getCollection(COLLECTIONS.ACTIONS);
  return await collection.find()
    .sort({ date: -1 })
    .limit(limit)
    .toArray();
}

// Create a new action
export async function createAction(actionData: Omit<Action, '_id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  const newAction: Action = {
    ...actionData,
    createdAt: now,
    updatedAt: now,
  };
  
  const collection = getCollection(COLLECTIONS.ACTIONS);
  const result = await collection.insertOne(newAction as any);
  
  return {
    ...newAction,
    _id: result.insertedId,
  };
}

// Update an existing action
export async function updateAction(id: string, actionData: Partial<Action>) {
  const collection = getCollection(COLLECTIONS.ACTIONS);
  
  const updateData = {
    ...actionData,
    updatedAt: new Date(),
  };
  
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Delete an action
export async function deleteAction(id: string) {
  const collection = getCollection(COLLECTIONS.ACTIONS);
  await collection.deleteOne({ _id: new ObjectId(id) });
  return { id };
}