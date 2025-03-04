// // src/lib/storage/gcp-storage.ts
// import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
// import { v4 as uuidv4 } from 'uuid';

// // Storage service interface
// export interface StorageService {
//   uploadFile: (file: Buffer, key: string, contentType: string) => Promise<{ key: string }>;
//   getPresignedUrl: (key: string, expiresIn?: number) => Promise<string>;
//   deleteFile: (key: string) => Promise<{ key: string }>;
//   generateFileKey: (entityType: string, entityId: string, filename: string) => string;
// }

// // Local development storage service - for when we don't need actual storage
// class LocalStorageService implements StorageService {
//   async uploadFile(file: Buffer, key: string, contentType: string): Promise<{ key: string }> {
//     console.log(`[LOCAL] Uploading file with key: ${key}, contentType: ${contentType}, size: ${file.length} bytes`);
//     return { key };
//   }

//   async getPresignedUrl(key: string): Promise<string> {
//     console.log(`[LOCAL] Getting presigned URL for key: ${key}`);
//     // In local dev, we could return a data URL for small files, but for simplicity:
//     return `/api/mock-files/${key}`;
//   }

//   async deleteFile(key: string): Promise<{ key: string }> {
//     console.log(`[LOCAL] Deleting file with key: ${key}`);
//     return { key };
//   }

//   generateFileKey(entityType: string, entityId: string, filename: string): string {
//     const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
//     const uniqueId = uuidv4();
//     return `${entityType.toLowerCase()}/${entityId}/${uniqueId}-${cleanFilename}`;
//   }
// }

// // Google Cloud Storage service implementation
// class GcpStorageService implements StorageService {
//   private storage: Storage;
//   private bucketName: string;

//   constructor() {
//     // GCP will automatically detect credentials from the environment
//     // or service account if running on Google Cloud
//     this.storage = new Storage();
//     this.bucketName = process.env.GCP_BUCKET_NAME || 'growtracker';
//   }

//   async uploadFile(file: Buffer, key: string, contentType: string): Promise<{ key: string }> {
//     const bucket = this.storage.bucket(this.bucketName);
//     const blob = bucket.file(key);
    
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//       metadata: {
//         contentType
//       }
//     });

//     return new Promise((resolve, reject) => {
//       blobStream.on('error', (err) => reject(err));
//       blobStream.on('finish', () => resolve({ key }));
//       blobStream.end(file);
//     });
//   }

//   async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
//     const bucket = this.storage.bucket(this.bucketName);
//     const file = bucket.file(key);

//     // Configuration for signed URL
//     const config: GetSignedUrlConfig = {
//       action: 'read',
//       expires: Date.now() + expiresIn * 1000
//     };

//     // Get a signed URL
//     const [url] = await file.getSignedUrl(config);
//     return url;
//   }

//   async deleteFile(key: string): Promise<{ key: string }> {
//     const bucket = this.storage.bucket(this.bucketName);
//     const file = bucket.file(key);
    
//     await file.delete();
//     return { key };
//   }

//   generateFileKey(entityType: string, entityId: string, filename: string): string {
//     const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
//     const uniqueId = uuidv4();
//     return `${entityType.toLowerCase()}/${entityId}/${uniqueId}-${cleanFilename}`;
//   }
// }

// // Factory function for storage service
// export function createStorageService(): StorageService {
//   // Check if we're running locally or have GCP credentials
//   if (process.env.NODE_ENV === 'development' && process.env.USE_LOCAL_STORAGE === 'true') {
//     return new LocalStorageService();
//   }
  
//   // Use GCP Storage
//   return new GcpStorageService();
// }

// // Create and export the storage service instance
// export const storageService = createStorageService();