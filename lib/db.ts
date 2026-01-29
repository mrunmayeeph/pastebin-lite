import { sql } from '@vercel/postgres';

export interface Paste {
  id: string;
  content: string;
  created_at: number;
  ttl_seconds: number | null;
  max_views: number | null;
  view_count: number;
}

/**
 * Initialize database table if it doesn't exist
 */
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pastes (
        id VARCHAR(255) PRIMARY KEY,
        content TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        ttl_seconds INTEGER,
        max_views INTEGER,
        view_count INTEGER DEFAULT 0
      )
    `;
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

/**
 * Create a new paste
 */
export async function createPaste(
  id: string,
  content: string,
  ttlSeconds: number | null,
  maxViews: number | null
): Promise<void> {
  const createdAt = Date.now();
  
  await sql`
    INSERT INTO pastes (id, content, created_at, ttl_seconds, max_views, view_count)
    VALUES (${id}, ${content}, ${createdAt}, ${ttlSeconds}, ${maxViews}, 0)
  `;
}

/**
 * Atomically fetch a paste and increment view count
 * Returns null if:
 * - paste does not exist
 * - expired by TTL
 * - view limit exceeded
 */
export async function getPasteAndIncrementViews(
  id: string,
  currentTimeMs: number
): Promise<Paste | null> {
  const result = await sql<Paste>`
    UPDATE pastes
    SET view_count = view_count + 1
    WHERE id = ${id}
      AND (
        ttl_seconds IS NULL
        OR ${currentTimeMs} < created_at + (ttl_seconds * 1000)
      )
      AND (
        max_views IS NULL
        OR view_count < max_views
      )
    RETURNING id, content, created_at, ttl_seconds, max_views, view_count
  `;

  // If no rows updated → unavailable
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}


/**
 * Get a paste by ID without incrementing view count (for HTML view)
 */
export async function getPasteWithoutIncrement(
  id: string,
  currentTimeMs: number
): Promise<Paste | null> {
  const result = await sql<Paste>`
    SELECT id, content, created_at, ttl_seconds, max_views, view_count
    FROM pastes
    WHERE id = ${id}
  `;

  if (result.rows.length === 0) {
    return null;
  }

  const paste = result.rows[0];

  // Check if expired by TTL
  if (paste.ttl_seconds !== null) {
    const expiresAt = paste.created_at + paste.ttl_seconds * 1000;
    if (currentTimeMs >= expiresAt) {
      return null;
    }
  }

  // Check if view limit reached
  if (paste.max_views !== null && paste.view_count >= paste.max_views) {
    return null;
  }

  return paste;
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Generate a unique ID for a paste
 */
export function generatePasteId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}