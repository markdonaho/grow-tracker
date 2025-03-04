// src/types/plant.ts
import { ObjectId } from "mongodb";

export type PlantStatus = "Growing" | "Harvested" | "Archived";
export type GrowCycleType = "Vegetative" | "Flowering";

export interface GrowthMetric {
  date: Date;
  height: number;
  notes?: string;
}

export interface Plant {
  _id?: ObjectId | string;
  name: string;
  strain: string;
  status: PlantStatus;
  startDate: Date;
  harvestDate?: Date;
  notes?: string;
  growCycleType: GrowCycleType;
  growthMetrics: GrowthMetric[];
  coverImageId?: string;
  createdAt: Date;
  updatedAt: Date;
}