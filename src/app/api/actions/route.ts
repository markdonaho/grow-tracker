// src/app/api/actions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRecentActions, getActionsForPlant, createAction } from '@/lib/db/actions';
import { ObjectId } from 'mongodb';

// GET /api/actions - Get recent actions or actions for a specific plant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get('plantId');
    
    // For now, we'll use mockData in Phase 1
    // In Phase 2, we'll uncomment the real implementation
    
    // let actions;
    // if (plantId) {
    //   actions = await getActionsForPlant(plantId);
    // } else {
    //   actions = await getRecentActions();
    // }
    
    let actions;
    if (plantId) {
      actions = mockActions.filter(action => action.plantId === plantId);
    } else {
      actions = mockActions;
    }
    
    return NextResponse.json(actions);
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
      { status: 500 }
    );
  }
}

// POST /api/actions - Create a new action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.plantId || !body.actionType || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In Phase 2, we'll uncomment the real implementation
    // const action = await createAction({
    //   plantId: new ObjectId(body.plantId),
    //   actionType: body.actionType,
    //   date: new Date(body.date),
    //   details: body.details || {},
    //   notes: body.notes,
    //   imageIds: body.imageIds || [],
    // });
    
    // For mock data in Phase 1
    const action = {
      _id: `mock-${Date.now()}`,
      plantId: body.plantId,
      actionType: body.actionType,
      date: new Date(body.date),
      details: body.details || {},
      notes: body.notes,
      imageIds: body.imageIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json(
      { error: 'Failed to create action' },
      { status: 500 }
    );
  }
}

// Mock data for Phase 1
const mockActions = [
  { 
    _id: '1', 
    plantId: '1', // Northern Lights
    actionType: 'Watering', 
    date: new Date('2025-02-03'), 
    details: {},
    notes: 'Standard watering, soil was quite dry.',
    createdAt: new Date('2025-02-03'),
    updatedAt: new Date('2025-02-03'),
  },
  { 
    _id: '2', 
    plantId: '1', // Northern Lights
    actionType: 'Feeding', 
    date: new Date('2025-01-28'), 
    details: {
      nutrients: [
        { name: 'Tiger Bloom', quantity: 10, unit: 'ml' },
        { name: 'Big Bloom', quantity: 6, unit: 'ml' },
      ]
    },
    notes: 'Tiger Bloom - 10ml, Big Bloom - 6ml',
    createdAt: new Date('2025-01-28'),
    updatedAt: new Date('2025-01-28'),
  },
  { 
    _id: '3', 
    plantId: '1', // Northern Lights
    actionType: 'Pruning', 
    date: new Date('2025-01-13'), 
    details: {},
    notes: 'Trimmed fan leaves and everything above trellis',
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  { 
    _id: '4', 
    plantId: '2', // White Widow
    actionType: 'Watering', 
    date: new Date('2025-01-10'), 
    details: {},
    notes: 'Standard watering',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  { 
    _id: '5', 
    plantId: '3', // AK-47
    actionType: 'Training', 
    date: new Date('2025-01-06'), 
    details: {},
    notes: 'Trimmed fan leaves. Took 2 clippings for clones.',
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06'),
  },
];