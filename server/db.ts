import './env';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';
import * as schema from '../shared/schema';

neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket;

let dbInstance: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    dbInstance = drizzle({ client: sql, schema });
    console.log('✅ Database connected with Drizzle (Neon HTTP).');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
    dbInstance = null;
  }
} else {
  console.log('ℹ️ DATABASE_URL not set, falling back to mock storage.');
}

export const db = dbInstance;