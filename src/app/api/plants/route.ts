// src/app/api/plants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPlants, createPlant } from '@/lib/db/plants';

// GET /api/plants - Get all plants
export async function GET(request: NextRequest) {
  try {
    // For now, we'll use mockData in Phase 1
    // In Phase 2, we'll uncomment the real implementation
    
    // const plants = await getPlants();
    const plants = mockPlants;
    
    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plants' },
      { status: 500 }
    );
  }
}

// POST /api/plants - Create a new plant
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
    
    // In Phase 2, we'll uncomment the real implementation
    // const plant = await createPlant({
    //   name: body.name,
    //   strain: body.strain,
    //   status: body.status,
    //   growCycleType: body.growCycleType,
    //   startDate: new Date(body.startDate || new Date()),
    //   notes: body.notes,
    //   growthMetrics: [],
    // });
    
    // For mock data in Phase 1
    const plant = {
      _id: `mock-${Date.now()}`,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error('Error creating plant:', error);
    return NextResponse.json(
      { error: 'Failed to create plant' },
      { status: 500 }
    );
  }
}

// Mock data for Phase 1
const mockPlants = [
  {
    _id: '1',
    name: 'Northern Lights',
    strain: 'Northern Lights',
    status: 'Growing',
    growCycleType: 'Flowering',
    startDate: new Date('2024-11-09'),
    currentHeight: 24,
    daysToHarvest: 24,
    growthMetrics: [
      { date: new Date('2024-11-09'), height: 5 },
      { date: new Date('2024-12-09'), height: 18 },
      { date: new Date('2025-01-09'), height: 24 },
    ],
    createdAt: new Date('2024-11-09'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    _id: '2',
    name: 'White Widow Mother',
    strain: 'White Widow',
    status: 'Growing',
    growCycleType: 'Vegetative',
    startDate: new Date('2024-10-15'),
    currentHeight: 18,
    daysToHarvest: null,
    growthMetrics: [
      { date: new Date('2024-10-15'), height: 3 },
      { date: new Date('2024-11-15'), height: 12 },
      { date: new Date('2024-12-15'), height: 18 },
    ],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: '3',
    name: 'AK-47 Clone #1',
    strain: 'AK-47',
    status: 'Growing',
    growCycleType: 'Vegetative',
    startDate: new Date('2025-01-10'),
    currentHeight: 8,
    daysToHarvest: null,
    growthMetrics: [
      { date: new Date('2025-01-10'), height: 3 },
      { date: new Date('2025-01-25'), height: 8 },
    ],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-25'),
  },
  {
    _id: '4',
    name: 'Blueberry Harvest',
    strain: 'Blueberry',
    status: 'Harvested',
    growCycleType: 'Flowering',
    startDate: new Date('2024-09-01'),
    harvestDate: new Date('2024-12-15'),
    currentHeight: 30,
    daysToHarvest: 0,
    growthMetrics: [
      { date: new Date('2024-09-01'), height: 5 },
      { date: new Date('2024-10-01'), height: 15 },
      { date: new Date('2024-11-01'), height: 25 },
      { date: new Date('2024-12-01'), height: 30 },
    ],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-12-15'),
  },
];