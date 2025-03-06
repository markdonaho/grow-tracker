// src/app/api/plants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getPlants, 
  getActivePlants,
  createPlant
} from '@/lib/db/plants';
import { Plant } from '@/types/plant';

/**
 * GET /api/plants - Get all plants
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let plants: Plant[];
    
    if (activeOnly) {
      plants = await getActivePlants();
    } else {
      plants = await getPlants();
    }
    
    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/plants - Create a new plant
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.strain || !body.status || !body.growCycleType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Format startDate as Date object if it's a string
    if (body.startDate && typeof body.startDate === 'string') {
      body.startDate = new Date(body.startDate);
    } else if (!body.startDate) {
      body.startDate = new Date();
    }
    
    // Initialize empty growthMetrics array if not provided
    if (!body.growthMetrics) {
      body.growthMetrics = [];
    }
    
    const plant = await createPlant(body);
    
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error('Error creating plant:', error);
    return NextResponse.json(
      { error: 'Failed to create plant' },
      { status: 500 }
    );
  }
}