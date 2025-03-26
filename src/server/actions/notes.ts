'use server';

import { db } from '@/server/db';
import { noteTable, personNoteMentionTable } from '@/server/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { authenticatedAction } from '@/server/actions/safe-action';
import { z } from 'zod';
import { notFound } from 'next/navigation';

export const getOwnNotes = authenticatedAction.action(async ({ ctx }) => {
  const { user } = ctx;
  const notes = await db.query.noteTable.findMany({
    where: eq(noteTable.userId, user.id),
    orderBy: desc(noteTable.updatedAt),
    with: {
      mentions: {
        with: {
          person: true,
        },
      },
    },
  });
  return notes;
});

export const getNote = authenticatedAction
  .schema(
    z.object({
      id: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput: { id } }) => {
    const { user } = ctx;
    const note = await db.query.noteTable.findFirst({
      where: and(eq(noteTable.id, id), eq(noteTable.userId, user.id)),
      with: {
        mentions: {
          with: {
            person: true,
          },
        },
      },
    });
    if (!note) {
      notFound();
    }
    return note;
  });

export const createNote = authenticatedAction
  .schema(
    z.object({
      content: z.string(),
      mentions: z.array(
        z.object({
          personId: z.string(),
          noteId: z.string(),
        }),
      ),
    }),
  )
  .action(async ({ ctx, parsedInput: { content, mentions } }) => {
    const { user } = ctx;
    const [note] = await db
      .insert(noteTable)
      .values({
        userId: user.id,
        title: 'Untitled',
        content,
      })
      .returning();
    if (mentions.length > 0) {
      await db.insert(personNoteMentionTable).values(
        mentions.map((mention) => ({
          personId: mention.personId,
          noteId: note.id,
        })),
      );
    }
    return note;
  });

export const updateNote = authenticatedAction
  .schema(
    z.object({
      id: z.string(),
      content: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput: { id, content } }) => {
    const { user } = ctx;
    const [note] = await db
      .update(noteTable)
      .set({
        content,
      })
      .where(and(eq(noteTable.id, id), eq(noteTable.userId, user.id)))
      .returning();
    return note;
  });

export const deleteNote = authenticatedAction
  .schema(
    z.object({
      id: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput: { id } }) => {
    const { user } = ctx;
    if (!user) {
      throw new Error('Unauthorized');
    }
    await db
      .delete(noteTable)
      .where(and(eq(noteTable.id, id), eq(noteTable.userId, user.id)));
  });
