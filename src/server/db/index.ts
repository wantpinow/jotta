import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';

import postgres from 'postgres';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';

import { serverEnv } from '@/env/server';

import * as schema from './schema';

export const initializePg = () => {
  const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
  };
  const conn = globalForDb.conn ?? postgres(serverEnv.DATABASE_URL);
  if (serverEnv.NODE_ENV !== 'production') globalForDb.conn = conn;
  const db = drizzlePostgres(conn, { schema });
  return { conn, db };
};

export const initializeNeon = () => {
  const conn = neon(serverEnv.DATABASE_URL);
  const db = drizzleNeon(conn, { schema });
  return { conn, db };
};

const isLocal = serverEnv.DATABASE_URL.includes('@localhost:');
export const { conn, db } = isLocal ? initializePg() : initializeNeon();
