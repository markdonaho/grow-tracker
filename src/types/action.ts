// src/types/action.ts
import { ObjectId } from "mongodb";

export type ActionType = "Watering" | "Feeding" | "Pruning" | "Training" | "Transplanting" | "Other";

export interface Nutrient {
  name: string;
  quantity: number;
  unit: string;
}

export interface ActionDetails {
  nutrients?: Nutrient[];
  [key: string]: unknown;
}

export interface Action {
  _id?: ObjectId | string;
  plantId: ObjectId | string;
  actionType: ActionType;
  date: Date;
  details?: ActionDetails;
  notes?: string;
  imageIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}