'use server';

import { auth } from '@/lib/auth/validate';
import { db } from '@/server/db';
import { personTable } from '@/server/db/schema';
import { and, desc, eq, ilike } from 'drizzle-orm';
import { Person } from '@/server/db/schema/types';

export async function getPeople() {
  const { user } = await auth();
  if (!user) {
    throw new Error('User not found');
  }
  const people = await db.query.personTable.findMany({
    where: eq(personTable.userId, user.id),
    orderBy: desc(personTable.updatedAt),
  });
  return people;
}

export async function getPeopleNames({
  query,
}: {
  query: string;
}): Promise<{ id: string; name: string }[]> {
  const { user } = await auth();
  if (!user) {
    throw new Error('User not found');
  }
  const people = await db.query.personTable.findMany({
    where: and(eq(personTable.userId, user.id), ilike(personTable.name, `%${query}%`)),
    orderBy: desc(personTable.updatedAt),
    columns: {
      id: true,
      name: true,
    },
  });
  return people;
}

export async function createPerson({
  name,
  description,
}: {
  name: string;
  description: string;
}): Promise<Person> {
  const { user } = await auth();
  if (!user) {
    throw new Error('User not found');
  }
  const [person] = await db
    .insert(personTable)
    .values({
      name,
      description,
      userId: user.id,
    })
    .returning();
  return person;
}

export async function deletePerson({ id }: { id: string }): Promise<void> {
  const { user } = await auth();
  if (!user) {
    throw new Error('User not found');
  }
  await db
    .delete(personTable)
    .where(and(eq(personTable.id, id), eq(personTable.userId, user.id)));
}

export async function getPerson({ id }: { id: string }): Promise<Person> {
  const { user } = await auth();
  if (!user) {
    throw new Error('User not found');
  }
  const person = await db.query.personTable.findFirst({
    where: and(eq(personTable.id, id), eq(personTable.userId, user.id)),
  });
  if (!person) {
    throw new Error('Person not found');
  }
  return person;
}

export async function updatePerson({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}): Promise<Person> {
  const { user } = await auth();
  if (!user) {
    throw new Error('User not found');
  }
  const [person] = await db
    .update(personTable)
    .set({
      name,
      description,
    })
    .where(and(eq(personTable.id, id), eq(personTable.userId, user.id)))
    .returning();
  return person;
}
