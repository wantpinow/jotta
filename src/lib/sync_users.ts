import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function createUser({ id, email }: { id: string; email: string }) {
  const user = await db.insert(users).values({
    id,
    email,
  });
  return user;
}

export async function deleteUser({ id }: { id: string }) {
  await db.delete(users).where(eq(users.id, id));
}
