'use server';

import { db } from '@/server/db';
import { personTable } from '@/server/db/schema';
import { and, desc, eq, ilike } from 'drizzle-orm';
import { authenticatedAction } from '@/server/actions/safe-action';
import { z } from 'zod';

export const getPeople = authenticatedAction.action(async ({ ctx }) => {
  const { user } = ctx;
  const people = await db.query.personTable.findMany({
    where: eq(personTable.userId, user.id),
    orderBy: desc(personTable.updatedAt),
  });
  return people;
});

export const getPeopleNames = authenticatedAction
  .schema(z.object({ query: z.string() }))
  .action(async ({ ctx, parsedInput: { query } }) => {
    const { user } = ctx;
    const people = await db.query.personTable.findMany({
      where: and(eq(personTable.userId, user.id), ilike(personTable.name, `%${query}%`)),
      orderBy: desc(personTable.updatedAt),
      columns: {
        id: true,
        name: true,
      },
    });
    return people;
  });

export const createPerson = authenticatedAction
  .schema(z.object({ name: z.string(), description: z.string() }))
  .action(async ({ ctx, parsedInput: { name, description } }) => {
    const { user } = ctx;
    const [person] = await db
      .insert(personTable)
      .values({
        name,
        description,
        userId: user.id,
      })
      .returning();
    return person;
  });

export const deletePerson = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput: { id } }) => {
    const { user } = ctx;
    await db
      .delete(personTable)
      .where(and(eq(personTable.id, id), eq(personTable.userId, user.id)));
  });

export const getPerson = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput: { id } }) => {
    const { user } = ctx;
    const person = await db.query.personTable.findFirst({
      where: and(eq(personTable.id, id), eq(personTable.userId, user.id)),
    });
    return person;
  });

export const updatePerson = authenticatedAction
  .schema(z.object({ id: z.string(), name: z.string(), description: z.string() }))
  .action(async ({ ctx, parsedInput: { id, name, description } }) => {
    const { user } = ctx;
    const [person] = await db
      .update(personTable)
      .set({
        name,
        description,
      })
      .where(and(eq(personTable.id, id), eq(personTable.userId, user.id)))
      .returning();
    return person;
  });
