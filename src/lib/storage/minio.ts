// src/lib/storage/minio.ts
/**
 * This file provides storage utility functions that can work with either:
 * 1. Local MinIO during development
 * 2. Google Cloud Storage in production
 * 
 * For development with MinIO, you'll need to install:
 * npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 * 
 * For production with GCP, you'll need to install:
 * npm install @google-cloud/storage
 */

// We're creating a more generic interface that can work with different storage backends
export interface StorageService {
  uploadFile: (file: Buffer, key: string, contentType: string) => Promise<{ key: string }>;
  getPresignedUrl: (key: string, expiresIn?: number) => Promise<string>;
  deleteFile: (key: string) => Promise<{ key: string }>;
  generateFileKey: (entityType: string, entityId: string, filename: string) => string;
}

// For now, we'll implement a mock storage service that logs operations
// This will be replaced with actual implementations in Phase 2
class MockStorageService implements StorageService {
  async uploadFile(file: Buffer, key: string, contentType: string): Promise<{ key: string }> {
    console.log(`[MOCK] Uploading file with key: ${key}, contentType: ${contentType}, size: ${file.length} bytes`);
    return { key };
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    console.log(`[MOCK] Getting presigned URL for key: ${key}, expires in: ${expiresIn}s`);
    return `/api/mock-presigned-url/${key}`;
  }

  async deleteFile(key: string): Promise<{ key: string }> {
    console.log(`[MOCK] Deleting file with key: ${key}`);
    return { key };
  }

  generateFileKey(entityType: string, entityId: string, filename: string): string {
    const timestamp = Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${entityType.toLowerCase()}/${entityId}/${timestamp}-${cleanFilename}`;
  }
}

// Export the mock storage service for now
export const storageService: StorageService = new MockStorageService();

/**
 * IMPORTANT: In Phase 2, we'll implement the actual services below:
 * 
 * For MinIO (development):
 * ```
 * import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
 * import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
 * 
 * class MinioStorageService implements StorageService {
 *   private s3Client: S3Client;
 *   private bucketName: string;
 *
 *   constructor() {
 *     this.s3Client = new S3Client({
 *       region: process.env.S3_REGION || 'us-east-1',
 *       endpoint: process.env.S3_ENDPOINT,
 *       forcePathStyle: true,
 *       credentials: {
 *         accessKeyId: process.env.S3_ACCESS_KEY || '',
 *         secretAccessKey: process.env.S3_SECRET_KEY || '',
 *       },
 *     });
 *     this.bucketName = process.env.S3_BUCKET || 'growtracker';
 *   }
 * 
 *   // Implementation of StorageService methods using MinIO/S3...
 * }
 * ```
 * 
 * For Google Cloud Storage (production):
 * ```
 * import { Storage } from '@google-cloud/storage';
 * 
 * class GcpStorageService implements StorageService {
 *   private storage: Storage;
 *   private bucketName: string;
 * 
 *   constructor() {
 *     this.storage = new Storage();
 *     this.bucketName = process.env.GCP_BUCKET_NAME || 'growtracker';
 *   }
 * 
 *   // Implementation of StorageService methods using GCP...
 * }
 * ```
 */