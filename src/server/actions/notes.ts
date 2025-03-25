'use server';

import { auth } from '@/lib/auth/validate';
import { db } from '@/server/db';
import { noteTable, personNoteMentionTable } from '@/server/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { Note, NoteWithMentions } from '@/server/db/schema/types';
import { MentionSuggestion } from '@/components/tiptap/mentions/mentionSuggestionOptions';

export async function getOwnNotes(): Promise<NoteWithMentions[]> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
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
}

export async function getNote({ id }: { id: string }): Promise<NoteWithMentions> {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }
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
    throw new Error('Note not found');
  }
  return note;
}

export async function createNote({
  content,
  mentions,
}: {
  content: string;
  mentions: MentionSuggestion[];
}): Promise<Note> {
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
  if (mentions.length > 0) {
    await db
      .insert(personNoteMentionTable)
      .values(
        mentions.map((mention) => ({
          personId: mention.id,
          noteId: note.id,
        })),
      )
      .returning();
  }
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
