'use server';

import { DatabaseUserAttributes } from '@/lib/auth';
import { auth } from '@/lib/auth/validate';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { userTable } from '@/server/db/schema';

export async function updateUser(userUpdates: Partial<DatabaseUserAttributes>) {
  const { user: userFromSession } = await auth();
  if (!userFromSession) {
    throw new Error('Unauthorized');
  }
  await db
    .update(userTable)
    .set({
      firstName: userUpdates.firstName,
      lastName: userUpdates.lastName,
    })
    .where(eq(userTable.id, userFromSession.id))
    .returning();
  return null;
}

export async function deleteUser() {
  const { user: userFromSession } = await auth();
  if (!userFromSession) {
    throw new Error('Unauthorized');
  }
  await db.delete(userTable).where(eq(userTable.id, userFromSession.id)).returning();
  return null;
}
