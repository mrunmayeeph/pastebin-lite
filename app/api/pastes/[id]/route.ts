import { NextRequest, NextResponse } from 'next/server';
import { getPasteAndIncrementViews } from '@/lib/db';
import { getCurrentTimeMs } from '@/lib/time';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Current time (supports TEST_MODE + x-test-now-ms)
    const now = getCurrentTimeMs(request);

    // Atomic fetch + increment (DB enforces TTL + max_views)
    const paste = await getPasteAndIncrementViews(id, now);

    // Unavailable cases → 404 (NOT 500)
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found or no longer available' },
        { status: 404 }
      );
    }

    // Compute remaining views
    const remainingViews =
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.view_count, 0);

    // Compute expiry time
    const expiresAt =
      paste.ttl_seconds === null
        ? null
        : new Date(
            Number(paste.created_at) +
              paste.ttl_seconds * 1000
          ).toISOString();

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: expiresAt
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('GET /api/pastes/:id failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
