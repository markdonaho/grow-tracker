// src/lib/storage/minio.ts
import { 
    S3Client, 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand 
  } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  
  // Initialize the S3 client with MinIO configuration
  const s3Client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true, // Required for MinIO
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
  });
  
  const bucketName = process.env.S3_BUCKET || 'growtracker';
  
  // Upload a file to MinIO
  export async function uploadFile(
    file: Buffer,
    key: string,
    contentType: string
  ) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });
  
    await s3Client.send(command);
    return { key };
  }
  
  // Generate a presigned URL for viewing an image
  export async function getPresignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
  
    return await getSignedUrl(s3Client, command, { expiresIn });
  }
  
  // Delete a file from MinIO
  export async function deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
  
    await s3Client.send(command);
    return { key };
  }
  
  // Generate a unique key for a file
  export function generateFileKey(entityType: string, entityId: string, filename: string) {
    const timestamp = Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${entityType.toLowerCase()}/${entityId}/${timestamp}-${cleanFilename}`;
  }