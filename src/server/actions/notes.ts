'use server';

import { auth } from '@/lib/auth/validate';
import { db } from '@/server/db';
import { noteTable } from '@/server/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { Note } from '@/server/db/schema/types';

export async function getOwnNotes(): Promise<Note[]> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const notes = await db.query.noteTable.findMany({
    where: eq(noteTable.userId, user.id),
    orderBy: desc(noteTable.updatedAt),
  });
  return notes;
}

export async function getNote({ id }: { id: string }): Promise<Note> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const note = await db.query.noteTable.findFirst({
    where: and(eq(noteTable.id, id), eq(noteTable.userId, user.id)),
  });
  if (!note) {
    throw new Error('Note not found');
  }
  return note;
}

export async function createNote({ content }: { content: string }): Promise<Note> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const [note] = await db
    .insert(noteTable)
    .values({
      userId: user.id,
      title: 'Untitled',
      content,
    })
    .returning();
  return note;
}

export async function updateNote({
  id,
  content,
}: {
  id: string;
  content: string;
}): Promise<Note> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const [note] = await db
    .update(noteTable)
    .set({
      content,
    })
    .where(and(eq(noteTable.id, id), eq(noteTable.userId, user.id)))
    .returning();
  return note;
}

export async function deleteNote({ id }: { id: string }): Promise<void> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db
    .delete(noteTable)
    .where(and(eq(noteTable.id, id), eq(noteTable.userId, user.id)));
}
