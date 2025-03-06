// src/app/api/actions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getRecentActions, 
  getActionsForPlant, 
  createAction 
} from '@/lib/db/actions';

/**
 * GET /api/actions - Get recent actions or actions for a specific plant
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get('plantId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    let actions;
    if (plantId) {
      actions = await getActionsForPlant(plantId);
    } else {
      actions = await getRecentActions(limit);
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

/**
 * POST /api/actions - Create a new action
 */
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
    
    // Convert date from string if necessary
    if (typeof body.date === 'string') {
      body.date = new Date(body.date);
    }
    
    // Ensure plantId is properly handled
    body.plantId = typeof body.plantId === 'string' 
      ? body.plantId
      : body.plantId.toString();
    
    const action = await createAction({
      plantId: body.plantId,
      actionType: body.actionType,
      date: body.date,
      details: body.details || {},
      notes: body.notes,
      imageIds: body.imageIds || [],
    });
    
    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json(
      { error: 'Failed to create action' },
      { status: 500 }
    );
  }
}