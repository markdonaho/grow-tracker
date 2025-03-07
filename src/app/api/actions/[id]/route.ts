import { NextRequest, NextResponse } from 'next/server';
import {
  getActionById,
  updateAction,
  deleteAction
} from '@/lib/db/actions';

// interface RouteParams {
//   id: string;
// }

/**
 * GET /api/actions/[id] - Get a specific action
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const action = await getActionById(id);
    if (!action) {
      return NextResponse.json(
        { error: 'Action not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(action);
  } catch (error) {
    console.error('Error fetching action:', error);
    return NextResponse.json(
      { error: 'Failed to fetch action' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/actions/[id] - Update an action
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Convert date from string if necessary
    if (body.date && typeof body.date === 'string') {
      body.date = new Date(body.date);
    }
    const updatedAction = await updateAction(id, body);
    if (!updatedAction) {
      return NextResponse.json(
        { error: 'Action not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedAction);
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json(
      { error: 'Failed to update action' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/actions/[id] - Delete an action
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteAction(id);
    if (!result) {
      return NextResponse.json(
        { error: 'Action not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting action:', error);
    return NextResponse.json(
      { error: 'Failed to delete action' },
      { status: 500 }
    );
  }
}
