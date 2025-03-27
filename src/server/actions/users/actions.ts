'use server';

import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { userTable } from '@/server/db/schema';
import { authenticatedAction } from '@/server/actions/safe-action';
import { updateUserSchema, updateUserImageSchema } from '@/server/actions/users/schemas';
import { revalidatePath } from 'next/cache';

export const updateUser = authenticatedAction
  .schema(updateUserSchema)
  .action(async ({ ctx: { user }, parsedInput: { firstName, lastName } }) => {
    const [updatedUser] = await db
      .update(userTable)
      .set({ firstName, lastName })
      .where(eq(userTable.id, user.id))
      .returning();
    revalidatePath('/settings/account');
    return updatedUser;
  });

export const updateUserImage = authenticatedAction
  .schema(updateUserImageSchema)
  .action(async ({ ctx: { user }, parsedInput: { imageUrl } }) => {
    const [updatedUser] = await db
      .update(userTable)
      .set({ image: imageUrl })
      .where(eq(userTable.id, user.id))
      .returning();
    revalidatePath('/settings/account');
    return updatedUser;
  });

export const deleteUser = authenticatedAction.action(async ({ ctx: { user } }) => {
  await db.delete(userTable).where(eq(userTable.id, user.id)).returning();
  revalidatePath('/');
  return true;
});
