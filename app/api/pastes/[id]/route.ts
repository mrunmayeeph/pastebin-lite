import { NextRequest, NextResponse } from 'next/server';
import { getPasteAndIncrementViews } from '@/lib/db';
import { getCurrentTimeMs } from '@/lib/time';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get current time (supports test mode)
    const currentTimeMs = getCurrentTimeMs(request);
    
    // Fetch paste and increment view count
    const paste = await getPasteAndIncrementViews(id, currentTimeMs);
    
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found or no longer available' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate remaining views
    let remainingViews: number | null = null;
    if (paste.max_views !== null) {
      remainingViews = paste.max_views - paste.view_count;
      if (remainingViews < 0) {
        remainingViews = 0;
      }
    }

    // Calculate expires_at
    let expiresAt: string | null = null;
    if (paste.ttl_seconds !== null) {
      const expiresAtMs = paste.created_at + paste.ttl_seconds * 1000;
      expiresAt = new Date(expiresAtMs).toISOString();
    }

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: expiresAt
      },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}