// src/app/api/plants/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getPlantById, 
  updatePlant, 
  deletePlant
} from '@/lib/db/plants';

type RouteParams = {
  params: { id: string };
};

/**
 * GET /api/plants/[id] - Get a specific plant
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
    
    return NextResponse.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plant' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/plants/[id] - Update a plant
 */
export async function PATCH(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Convert dates from strings if necessary
    if (body.startDate && typeof body.startDate === 'string') {
      body.startDate = new Date(body.startDate);
    }
    
    if (body.harvestDate && typeof body.harvestDate === 'string') {
      body.harvestDate = new Date(body.harvestDate);
    }
    
    const updatedPlant = await updatePlant(id, body);
    
    if (!updatedPlant) {
      return NextResponse.json(
        { error: 'Plant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPlant);
  } catch (error) {
    console.error('Error updating plant:', error);
    return NextResponse.json(
      { error: 'Failed to update plant' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/plants/[id] - Delete a plant
 */
export async function DELETE(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const result = await deletePlant(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Plant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting plant:', error);
    return NextResponse.json(
      { error: 'Failed to delete plant' },
      { status: 500 }
    );
  }
}