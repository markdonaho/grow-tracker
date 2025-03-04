// src/lib/storage/minio.ts
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Storage service interface
export interface StorageService {
  uploadFile: (file: Buffer, key: string, contentType: string) => Promise<{ key: string }>;
  getPresignedUrl: (key: string, expiresIn?: number) => Promise<string>;
  deleteFile: (key: string) => Promise<{ key: string }>;
  generateFileKey: (entityType: string, entityId: string, filename: string) => string;
}

// MinIO storage service implementation
class MinioStorageService implements StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
    });
    this.bucketName = process.env.S3_BUCKET || 'growtracker';
  }

  /**
   * Upload a file to storage
   */
  async uploadFile(file: Buffer, key: string, contentType: string): Promise<{ key: string }> {
    // Create command to put object in bucket
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    // Execute command
    await this.s3Client.send(command);
    
    return { key };
  }

  /**
   * Get a presigned URL for downloading a file
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    // Create command to get object from bucket
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    // Generate signed URL
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(key: string): Promise<{ key: string }> {
    // Create command to delete object from bucket
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    // Execute command
    await this.s3Client.send(command);
    
    return { key };
  }

  /**
   * Generate a unique file key
   */
  generateFileKey(entityType: string, entityId: string, filename: string): string {
    // Clean the filename to remove special characters
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Create a unique key using UUID
    const uniqueId = uuidv4();
    
    // Path format: entityType/entityId/uniqueId-filename
    return `${entityType.toLowerCase()}/${entityId}/${uniqueId}-${cleanFilename}`;
  }
}

// For local development without MinIO, use a mock storage service
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
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueId = uuidv4();
    return `${entityType.toLowerCase()}/${entityId}/${uniqueId}-${cleanFilename}`;
  }
}

// Factory function for storage service - can be extended to support other storage providers
export function createStorageService(): StorageService {
  // Check if we should use mock storage
  if (process.env.USE_MOCK_STORAGE === 'true') {
    return new MockStorageService();
  }
  
  // Otherwise, use MinIO for local development
  return new MinioStorageService();
}

// Create and export the storage service instance
export const storageService = createStorageService();