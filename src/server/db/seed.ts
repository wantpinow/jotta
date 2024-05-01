import * as csv from "csv-parse";
import fs from "fs";
import { db } from "~/server/db";
import {
  cards,
  decks,
  users,
  validPosTags,
  vocabItems,
} from "~/server/db/schema";

export const seed = async () => {
  console.log("Seeding...");
  console.time("DB has been seeded!");

  // database teardown
  await db.delete(cards);
  await db.delete(decks);
  await db.delete(users);
  await db.delete(vocabItems);

  // database setup
  const [user] = await db
    .insert(users)
    .values([
      {
        id: "user_2fWCKalXmLnivD0LkzKykkS9dwa",
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
        name: "Locations",
        description: "Countries, cities, and landmarks",
        userId: user.id,
        icon: "MapPin",
      },
      {
        name: "Regular Verbs",
        description: "Common verbs",
        userId: user.id,
        icon: "Drum",
      },
      {
        name: "Going Out",
        description: "Ordering food, asking for directions, etc.",
        userId: user.id,
        icon: "Drama",
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

  // // vocab items
  // const vocabCsvFile = "ml/research/data/vocab/spanish-5000-clean-auto.csv";
  // const content = fs.readFileSync(vocabCsvFile, "utf8");
  // const records = csv.parse(content, { bom: true });
  // let first = true;
  // let vocabInserts = [];
  // for await (const record of records) {
  //   if (first) {
  //     first = false;
  //     continue;
  //   }
  //   const [spanish, english, POS, lemma, lemma_valid] = record as [
  //     string,
  //     string,
  //     string,
  //     string,
  //     string,
  //   ];
  //   if (lemma_valid.toLowerCase() === "false") {
  //     continue;
  //   }
  //   if (POS !== "NOUN" && POS !== "VERB" && POS !== "ADJ") {
  //     continue;
  //   }
  //   vocabInserts.push({
  //     userId: user.id,
  //     spanish,
  //     english,
  //     posTag: POS as (typeof validPosTags)[number],
  //   });
  // }
  // await db.insert(vocabItems).values(vocabInserts);
  // console.log("vocabInserts", vocabInserts.length);
  console.timeEnd("DB has been seeded!");
};

try {
  await seed();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
