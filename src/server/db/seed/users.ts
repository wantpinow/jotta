import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';

export async function seedUsers(db: PostgresJsDatabase<typeof schema>) {
  // database teardown
  await db.delete(schema.userTable);
  await db.delete(schema.sessionTable);

  // add dev user and session for testing
  // (this is so we don't have to use ouath for local development)
  await db.insert(schema.userTable).values({
    id: 'd80b6798-1a90-43b1-9146-007721016738',
    email: 'test@dev.com',
    passwordHash: 'k36NX7tIvUlJU2zWW401xCa4DS+DDFwwjizexCKuIkQ=',
    firstName: 'Dev',
    lastName: 'User',
  });
  await db.insert(schema.sessionTable).values({
    id: 'cbyynbxvmwbj5egjsxd2jdexzeb2foa5av2zhfom',
    userId: 'd80b6798-1a90-43b1-9146-007721016738',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });
}
