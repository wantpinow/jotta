// import * as csv from "csv-parse";
// import { asc, desc, max, sql } from "drizzle-orm";
// import fs from "fs";
// import { l2Distance } from "pgvector/drizzle-orm";
// import { db } from "~/server/db";
// import {
//   type validPosTags,
//   vocabItems,
//   vocabItemsAttributes,
// } from "~/server/db/schema";

// export const seed = async () => {
//   // database teardown
//   await db.delete(vocabItems);
//   await db.delete(vocabItemsAttributes);

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

//   // add vocab item attributes
//   const vocabItemAttributes = vocabItemsResult.map((vocabItem) => {
//     return {
//       userId,
//       type: "english" as const,
//       vocabItemId: vocabItem.id,
//       key: vocabItem.english,
//       embedding: Array.from({ length: 1536 }, () => Math.random()),
//     };
//   });
//   console.time("Inserting vocab item attributes");
//   await db.insert(vocabItemsAttributes).values(vocabItemAttributes);
//   console.timeEnd("Inserting vocab item attributes");

//   // do a
//   console.time("Fetching top 5 vocab item attributes");
//   const closestAttributes = await db
//     .select()
//     .from(vocabItemsAttributes)
//     .orderBy(
//       l2Distance(
//         vocabItemsAttributes.embedding,
//         Array.from({ length: 1536 }, () => Math.random()),
//       ),
//     )
//     .limit(5);
//   console.timeEnd("Fetching top 5 vocab item attributes");

//   console.time("Fetching top 5 vocab item attributes (using `sql`)");
//   const embeddingStr = JSON.stringify(
//     Array.from({ length: 1536 }, () => Math.random()),
//   );
//   // const res = await db.execute(
//   //   sql`select ${vocabItemsAttributes.vocabItemId} from ${vocabItemsAttributes} group by ${vocabItemsAttributes.vocabItemId} order by MAX(${vocabItemsAttributes.embedding} <=> '${sql.raw(embeddingStr)}')  limit 5`,
//   // );
//   // const res = await db.execute(
//   //   sql`select ${vocabItemsAttributes.vocabItemId} from ${vocabItemsAttributes} group by ${vocabItemsAttributes.vocabItemId} order by MAX(${vocabItemsAttributes.embedding} <=> '${embeddingStr}')  limit 5`.mapWith(embeddingStr),
//   // );
//   const res = await db
//     .select({
//       vocabItemId: vocabItemsAttributes.vocabItemId,
//       l2: max(
//         l2Distance(
//           vocabItemsAttributes.embedding,
//           Array.from({ length: 1536 }, () => Math.random()),
//         ),
//       ).as("l2"),
//     })
//     .from(vocabItemsAttributes)
//     .orderBy(({ l2 }) => asc(l2))
//     .groupBy(vocabItemsAttributes.vocabItemId)
//     .limit(5);
//   console.log(res);
//   console.timeEnd("Fetching top 5 vocab item attributes (using `sql`)");
// };

// try {
//   await seed();
//   process.exit(0);
// } catch (e) {
//   console.error(e);
//   process.exit(1);
// }
