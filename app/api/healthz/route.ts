import { NextResponse } from 'next/server';
import { checkDatabaseHealth, initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database if needed
    await initializeDatabase();
    
    // Check database connection
    const dbHealthy = await checkDatabaseHealth();
    
    return NextResponse.json(
      { ok: dbHealthy },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}