import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function createUser({
  id,
  email,
  firstName,
  lastName,
}: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  const user = await db.insert(users).values({
    id,
    email,
    firstName,
    lastName,
  });
  return user;
}

export async function updateUser({
  id,
  email,
  firstName,
  lastName,
}: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  const user = await db
    .update(users)
    .set({
      email,
      firstName,
      lastName,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));
  return user;
}

export async function deleteUser({ id }: { id: string }) {
  await db.delete(users).where(eq(users.id, id));
}
