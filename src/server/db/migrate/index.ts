import 'dotenv/config';

import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { initializePg } from '../index';

export const runMigrations = async () => {
  // dummy for now, just to make it run
  const { conn, db } = initializePg();

  await migrate(db, { migrationsFolder: './drizzle' });

  await conn.end();
};

const main = async () => {
  try {
    await runMigrations();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
