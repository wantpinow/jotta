// import * as csv from "csv-parse";
// import fs from "fs";
// import { db } from "~/server/db";
// import { vocabItems } from "~/server/db/schema";

// export const seed = async () => {
//   console.log("Seeding...");

//   // database teardown
//   await db.delete(vocabItems);
//   const userId = "user_2fWCKalXmLnivD0LkzKykkS9dwa";

//   // vocab items
//   const vocabCsvFile = "ml/research/data/vocab/spanish-5000-clean-auto.csv";
//   const content = fs.readFileSync(vocabCsvFile, "utf8");
//   const records = csv.parse(content, { bom: true });
//   let first = true;
//   const vocabInserts = [];
//   for await (const record of records) {
//     if (first) {
//       first = false;
//       continue;
//     }
//     const [spanish, english, POS, lemma, lemma_valid] = record as [
//       string,
//       string,
//       string,
//       string,
//       string,
//     ];
//     if (lemma_valid.toLowerCase() === "false") {
//       continue;
//     }
//     if (POS !== "NOUN" && POS !== "VERB" && POS !== "ADJ") {
//       continue;
//     }
//     vocabInserts.push({
//       userId,
//       spanish,
//       english,
//       posTag: POS,
//       englishEmbedding: Array.from({ length: 1536 }, () => Math.random()),
//     });
//   }
//   console.time("DB has been seeded!");
//   await db.insert(vocabItems).values(vocabInserts);
//   console.log("vocabInserts", vocabInserts.length);
//   console.timeEnd("DB has been seeded!");

//   // fetch all vocab items
//   console.time("Fetching all vocab items");
//   const vocabItemsResult = await db.query.vocabItems.findMany();
//   console.timeEnd("Fetching all vocab items");

//   console.log("vocabItemsResult", vocabItemsResult.length);
// };

// try {
//   await seed();
//   process.exit(0);
// } catch (e) {
//   console.error(e);
//   process.exit(1);
// }
