import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/server/db/schema';
import { NOTIFICATION_TYPES } from '@/lib/notifications';

export async function seedUsers(db: PostgresJsDatabase<typeof schema>) {
  // database teardown
  await db.delete(schema.userTable);
  await db.delete(schema.sessionTable);
  await db.delete(schema.userNotificationsTable);

  // add dev user and session for testing
  // (this is so we don't have to use ouath for local development)
  const userId = 'd80b6798-1a90-43b1-9146-007721016738';
  const sessionId = 'cbyynbxvmwbj5egjsxd2jdexzeb2foa5av2zhfom';
  const passwordHash = 'k36NX7tIvUlJU2zWW401xCa4DS+DDFwwjizexCKuIkQ='; // test1234

  await db.insert(schema.userTable).values({
    id: userId,
    email: 'test@dev.com',
    passwordHash,
    firstName: 'Dev',
    lastName: 'User',
  });
  await db.insert(schema.sessionTable).values({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });

  // add example notifications for all notification types
  await db.insert(schema.userNotificationsTable).values([
    {
      userId,
      type: 'WELCOME',
      description:
        'Thanks for joining. Start building your personal knowledge base today.',
    },
    {
      userId,
      type: 'NEW_FEATURE',
      description: 'Stay informed with our new notification system.',
    },
    {
      userId,
      type: 'FEATURE_UPDATE',
      description: "We've improved how you can mention and track people in your notes.",
    },
  ]);
}
