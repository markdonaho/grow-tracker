// src/types/image.ts
import { ObjectId } from "mongodb";

export type EntityType = "Plant" | "Action";

export interface ImageMetadata {
  _id?: ObjectId;
  s3Key: string;
  filename: string;
  contentType: string;
  size: number;
  entityType: EntityType;
  entityId: ObjectId;
  uploadDate: Date;
}