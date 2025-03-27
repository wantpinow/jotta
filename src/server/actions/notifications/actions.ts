'use server';

import { db } from '@/server/db';
import { authenticatedAction } from '@/server/actions/safe-action';
import { userNotificationsTable } from '@/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const getUserNotifications = authenticatedAction
  .schema(
    z.object({
      limit: z.number().optional().default(5),
    }),
  )
  .action(async ({ ctx: { user }, parsedInput: { limit } }) => {
    const notifications = await db.query.userNotificationsTable.findMany({
      // todo: how to get the count of all notifications???
      where: and(
        eq(userNotificationsTable.userId, user.id),
        eq(userNotificationsTable.read, false),
      ),
      orderBy: desc(userNotificationsTable.createdAt),
      limit,
    });
    return notifications;
  });

export const readNotification = authenticatedAction
  .schema(
    z.object({
      notificationId: z.string().uuid(),
    }),
  )
  .action(async ({ ctx: { user }, parsedInput: { notificationId } }) => {
    const notifications = await db
      .update(userNotificationsTable)
      .set({
        read: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(userNotificationsTable.userId, user.id),
          eq(userNotificationsTable.id, notificationId),
        ),
      );
    revalidatePath('/');
    return notifications;
  });
