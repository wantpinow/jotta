'use server';

import { auth } from '@/lib/auth/validate';
import { db } from '@/server/db';
import { noteTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { Note } from '@/server/db/schema/types';

export async function getOwnNotes(): Promise<Note[]> {
  // wait for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const notes = await db.query.noteTable.findMany({
    where: eq(noteTable.userId, user.id),
  });
  return notes;
}
