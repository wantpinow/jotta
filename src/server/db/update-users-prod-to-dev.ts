// a script to update the ids in the `users` table from production to development ids
import { type User, clerkClient } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";

import { users } from "./schema";

export const updateUsersProdToDev = async () => {
  // get all users currently in the db
  const dbProdUsers = await db.query.users.findMany();

  // get these users from production
  const limit = 10;
  let offset = 0;
  let clerkDevUsers: User[] = [];
  while (true) {
    const response = await clerkClient.users.getUserList({
      emailAddress: dbProdUsers.map((user) => user.email),
      offset,
      limit,
    });
    clerkDevUsers = clerkDevUsers.concat(response.data);
    if (response.totalCount <= offset + limit) {
      break;
    }
    offset += 10;
  }

  // update the ids of all dbProdUsers with an email in the clerkDevUsers
  for (const dbProdUser of dbProdUsers) {
    const clerkDevUser = clerkDevUsers.find(
      (user) => user.primaryEmailAddress?.emailAddress === dbProdUser.email,
    );
    if (clerkDevUser === undefined) {
      continue;
    }
    if (dbProdUser.id === clerkDevUser.id) {
      continue;
    }
    await db
      .update(users)
      .set({
        id: clerkDevUser.id,
      })
      .where(eq(users.id, dbProdUser.id));
    console.log(`Updated user ${dbProdUser.id} to ${clerkDevUser.id}`);
  }
};

try {
  await updateUsersProdToDev();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
