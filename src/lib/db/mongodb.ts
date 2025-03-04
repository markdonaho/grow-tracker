// src/lib/db/mongodb.ts
import { MongoClient, Db, Collection, ObjectId, Document } from 'mongodb';
import { Plant } from '@/types/plant';
import { Action } from '@/types/action';
import { ImageMetadata } from '@/types/image';

// MongoDB connection string and database name should be in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://growtracker_user:growtracker_password@localhost:27017/growtracker';
const MONGODB_DB = process.env.MONGODB_DB || 'growtracker';

// Collection names as constants
export const COLLECTIONS = {
  PLANTS: 'plants',
  ACTIONS: 'actions',
  IMAGES: 'images',
};

// Interface for the global connection cache
interface MongoConnection {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

// Create the global connection object that preserves the connection across hot reloads
declare global {
  var mongodb: MongoConnection | undefined;
}

// Initialize global connection object if it doesn't exist
const globalMongoConnection = global.mongodb || {
  client: null,
  db: null,
  promise: null,
};

// Cache the connection in development
if (process.env.NODE_ENV === 'development') {
  global.mongodb = globalMongoConnection;
}

/**
 * Connect to MongoDB - creates a new client if one doesn't exist
 * Caches the client and connection to prevent multiple connections
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we have the connection cached, return it
  if (globalMongoConnection.client && globalMongoConnection.db) {
    return {
      client: globalMongoConnection.client,
      db: globalMongoConnection.db,
    };
  }

  // If we're currently connecting, return the promise
  if (globalMongoConnection.promise) {
    return globalMongoConnection.promise;
  }

  // Otherwise, create a new connection
  const options = {};

  // Create a new promise to connect
  globalMongoConnection.promise = new Promise(async (resolve, reject) => {
    try {
      // Create a new MongoClient
      const client = new MongoClient(MONGODB_URI, options);
      await client.connect();
      const db = client.db(MONGODB_DB);
      
      // Save to cache
      globalMongoConnection.client = client;
      globalMongoConnection.db = db;
      
      resolve({ client, db });
    } catch (error) {
      reject(error);
    }
  });

  return globalMongoConnection.promise;
}

/**
 * Get a typed collection from the database
 */
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Helper functions to get typed collections
 */
export async function getPlantsCollection(): Promise<Collection<Plant>> {
  return getCollection<Plant>(COLLECTIONS.PLANTS);
}

export async function getActionsCollection(): Promise<Collection<Action>> {
  return getCollection<Action>(COLLECTIONS.ACTIONS);
}

export async function getImagesCollection(): Promise<Collection<ImageMetadata>> {
  return getCollection<ImageMetadata>(COLLECTIONS.IMAGES);
}

/**
 * Create an ObjectId from a string
 */
export function createObjectId(id: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch (error) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}

/**
 * Convert MongoDB document _id to string in all objects in an array
 */
export function sanitizeDocuments<T>(documents: T[]): T[] {
  return documents.map(doc => sanitizeDocument(doc));
}

/**
 * Convert MongoDB document _id to string
 */
export function sanitizeDocument<T>(document: T): T {
  if (!document) return document;
  
  const sanitized = { ...document } as any;
  
  if (sanitized._id instanceof ObjectId) {
    sanitized._id = sanitized._id.toString();
  }
  
  return sanitized as T;
}