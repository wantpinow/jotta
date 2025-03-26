'use server';

import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { userTable } from '@/server/db/schema';
import { authenticatedAction } from '@/server/actions/safe-action';
import { updateUserSchema } from './schemas';

export const updateUser = authenticatedAction
  .schema(updateUserSchema)
  .action(async ({ ctx: { user }, parsedInput: { firstName, lastName } }) => {
    const [updatedUser] = await db
      .update(userTable)
      .set({ firstName, lastName })
      .where(eq(userTable.id, user.id))
      .returning();
    return updatedUser;
  });

export const deleteUser = authenticatedAction.action(async ({ ctx: { user } }) => {
  await db.delete(userTable).where(eq(userTable.id, user.id)).returning();
  return true;
});
