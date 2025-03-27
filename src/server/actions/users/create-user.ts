import { db } from '@/server/db';
import { userNotificationsTable, userTable } from '@/server/db/schema';

export const createUser = async (values: typeof userTable.$inferInsert) => {
  // create a new user
  const [user] = await db.insert(userTable).values(values).returning();

  // create a welcome notification
  await db.insert(userNotificationsTable).values({
    userId: user.id,
    type: 'WELCOME',
    description: 'Welcome to Jotta!',
  });

  return user;
};
