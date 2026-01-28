import { NextRequest, NextResponse } from 'next/server';
import { createPaste, generatePasteId, initializeDatabase } from '@/lib/db';

interface CreatePasteRequest {
  content?: string;
  ttl_seconds?: number;
  max_views?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Parse request body
    let body: CreatePasteRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate content
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate ttl_seconds
    let ttlSeconds: number | null = null;
    if (body.ttl_seconds !== undefined) {
      if (typeof body.ttl_seconds !== 'number' || !Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      ttlSeconds = body.ttl_seconds;
    }

    // Validate max_views
    let maxViews: number | null = null;
    if (body.max_views !== undefined) {
      if (typeof body.max_views !== 'number' || !Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      maxViews = body.max_views;
    }

    // Generate unique ID
    const id = generatePasteId();

    // Create paste in database
    await createPaste(id, body.content, ttlSeconds, maxViews);

    // Build URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}/p/${id}`;

    return NextResponse.json(
      { id, url },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}