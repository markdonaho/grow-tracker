// src/app/api/plants/[id]/growth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addGrowthMetric, getPlantById } from '@/lib/db/plants';

type RouteParams = {
  params: { id: string };
};

/**
 * GET /api/plants/[id]/growth - Get growth metrics for a plant
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const plant = await getPlantById(id);
    
    if (!plant) {
      return NextResponse.json(
        { error: 'Plant not found' },
        { status: 404 }
      );
    }
    
    // Return just the growth metrics
    return NextResponse.json(plant.growthMetrics || []);
  } catch (error) {
    console.error('Error fetching growth metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch growth metrics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/plants/[id]/growth - Add a growth metric to a plant
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate the metric data
    if (!body.height || (body.height && typeof body.height !== 'number')) {
      return NextResponse.json(
        { error: 'Valid height is required as a number' },
        { status: 400 }
      );
    }
    
    // Use current date if none provided
    const date = body.date ? new Date(body.date) : new Date();
    
    // Add the growth metric
    const updatedPlant = await addGrowthMetric(id, {
      date,
      height: body.height,
      notes: body.notes
    });
    
    if (!updatedPlant) {
      return NextResponse.json(
        { error: 'Plant not found' },
        { status: 404 }
      );
    }
    
    // Return the updated growth metrics
    return NextResponse.json(updatedPlant.growthMetrics || [], { status: 201 });
  } catch (error) {
    console.error('Error adding growth metric:', error);
    return NextResponse.json(
      { error: 'Failed to add growth metric' },
      { status: 500 }
    );
  }
}