import { db } from "~/server/db";
import { cards, decks, users } from "~/server/db/schema";

export const seed = async () => {
  console.log("Seeding...");
  console.time("DB has been seeded!");

  // database teardown
  await db.delete(cards);
  await db.delete(decks);
  await db.delete(users);

  // database setup
  const [user] = await db
    .insert(users)
    .values([
      {
        id: "user_2fSGtZMX9snKmPPkD1sxX5twYl8",
        email: "patrick@frenett.net",
        firstName: "Patrick",
        lastName: "Frenett",
      },
    ])
    .returning();
  if (user === undefined) {
    throw new Error("Failed to seed user");
  }
  const [deck] = await db
    .insert(decks)
    .values([
      {
        name: "My Deck",
        description: "This is my deck",
        userId: user.id,
      },
    ])
    .returning();
  if (deck === undefined) {
    throw new Error("Failed to seed deck");
  }
  await db
    .insert(cards)
    .values([
      {
        deckId: deck.id,
        front: "Front of card",
        back: "Back of card",
      },
    ])
    .returning();
  if (!deck) {
    throw new Error("Failed to seed deck");
  }

  console.timeEnd("DB has been seeded!");
};

try {
  await seed();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
