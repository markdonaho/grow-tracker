// src/lib/db/actions.ts
import { ObjectId } from 'mongodb';
import { 
  getActionsCollection, 
  createObjectId, 
  sanitizeDocument, 
  sanitizeDocuments 
} from './mongodb';
import { Action, ActionType } from '@/types/action';

/**
 * Get actions for a specific plant
 */
export async function getActionsForPlant(plantId: string): Promise<Action[]> {
  try {
    const collection = await getActionsCollection();
    const actions = await collection.find({ 
      plantId: createObjectId(plantId) 
    }).sort({ date: -1 }).toArray();
    
    return sanitizeDocuments(actions);
  } catch (error) {
    console.error('Error getting actions for plant:', error);
    return [];
  }
}

/**
 * Get actions by type for a specific plant
 */
export async function getActionsByTypeForPlant(plantId: string, actionType: ActionType): Promise<Action[]> {
  try {
    const collection = await getActionsCollection();
    const actions = await collection.find({ 
      plantId: createObjectId(plantId),
      actionType
    }).sort({ date: -1 }).toArray();
    
    return sanitizeDocuments(actions);
  } catch (error) {
    console.error('Error getting actions by type for plant:', error);
    return [];
  }
}

/**
 * Get all recent actions
 */
export async function getRecentActions(limit = 10): Promise<Action[]> {
  try {
    const collection = await getActionsCollection();
    const actions = await collection.find()
      .sort({ date: -1 })
      .limit(limit)
      .toArray();
    
    return sanitizeDocuments(actions);
  } catch (error) {
    console.error('Error getting recent actions:', error);
    return [];
  }
}

/**
 * Get an action by ID
 */
export async function getActionById(id: string): Promise<Action | null> {
  try {
    const collection = await getActionsCollection();
    const action = await collection.findOne({ _id: createObjectId(id) });
    
    return action ? sanitizeDocument(action) : null;
  } catch (error) {
    console.error('Error getting action by ID:', error);
    return null;
  }
}

/**
 * Create a new action
 */
export async function createAction(
  actionData: Omit<Action, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Action> {
  const now = new Date();
  
  // Ensure we have a proper ObjectId for plantId
  const plantId = typeof actionData.plantId === 'string' 
    ? createObjectId(actionData.plantId) 
    : actionData.plantId;
  
  const newAction: Omit<Action, '_id'> = {
    ...actionData,
    plantId,
    createdAt: now,
    updatedAt: now,
  };
  
  const collection = await getActionsCollection();
  const result = await collection.insertOne(newAction as any);
  
  return {
    ...newAction,
    _id: result.insertedId.toString(),
  } as Action;
}

/**
 * Update an existing action
 */
export async function updateAction(id: string, actionData: Partial<Action>): Promise<Action | null> {
  try {
    const collection = await getActionsCollection();
    
    // Process plantId if it's present and a string
    let updateData = { ...actionData };
    if (typeof updateData.plantId === 'string') {
      updateData.plantId = createObjectId(updateData.plantId);
    }
    
    // Add updated timestamp
    updateData = {
      ...updateData,
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
    console.error('Error updating action:', error);
    return null;
  }
}

/**
 * Delete an action
 */
export async function deleteAction(id: string): Promise<{ id: string } | null> {
  try {
    const collection = await getActionsCollection();
    const result = await collection.deleteOne({ _id: createObjectId(id) });
    
    if (result.deletedCount === 1) {
      return { id };
    }
    
    return null;
  } catch (error) {
    console.error('Error deleting action:', error);
    return null;
  }
}

/**
 * Add an image to an action
 */
export async function addImageToAction(actionId: string, imageId: string): Promise<Action | null> {
  try {
    const collection = await getActionsCollection();
    
    const result = await collection.findOneAndUpdate(
      { _id: createObjectId(actionId) },
      { 
        $addToSet: { imageIds: imageId },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    return result ? sanitizeDocument(result) : null;
  } catch (error) {
    console.error('Error adding image to action:', error);
    return null;
  }
}

/**
 * Remove an image from an action
 */
export async function removeImageFromAction(actionId: string, imageId: string): Promise<Action | null> {
  try {
    const collection = await getActionsCollection();
    
    const result = await collection.findOneAndUpdate(
      { _id: createObjectId(actionId) },
      { 
        $pull: { imageIds: imageId },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    return result ? sanitizeDocument(result) : null;
  } catch (error) {
    console.error('Error removing image from action:', error);
    return null;
  }
}

/**
 * Get actions count by type for a plant
 */
export async function getActionCountByType(plantId: string): Promise<Record<ActionType, number>> {
  try {
    const collection = await getActionsCollection();
    
    const pipeline = [
      { 
        $match: { 
          plantId: createObjectId(plantId) 
        } 
      },
      { 
        $group: { 
          _id: '$actionType', 
          count: { $sum: 1 } 
        } 
      }
    ];
    
    const result = await collection.aggregate(pipeline).toArray();
    
    // Initialize with zero counts for all action types
    const counts: Partial<Record<ActionType, number>> = {};
    const actionTypes: ActionType[] = ['Watering', 'Feeding', 'Pruning', 'Training', 'Transplanting', 'Other'];
    
    actionTypes.forEach(type => {
      counts[type] = 0;
    });
    
    // Update with actual counts
    result.forEach(item => {
      counts[item._id as ActionType] = item.count;
    });
    
    return counts as Record<ActionType, number>;
  } catch (error) {
    console.error('Error getting action count by type:', error);
    return {
      'Watering': 0,
      'Feeding': 0,
      'Pruning': 0,
      'Training': 0,
      'Transplanting': 0,
      'Other': 0
    };
  }
}