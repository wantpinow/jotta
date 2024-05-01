// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { relations, sql } from "drizzle-orm";
import {
  json,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { vector } from "pgvector/drizzle-orm";

import { conn } from ".";
import { iconNames } from "./icons";

// conn`CREATE EXTENSION IF NOT EXISTS vector`;

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `jotta_${name}`);

// declaring enum in database
export const iconEnum = pgEnum("icon", iconNames);

export const users = createTable("user", {
  id: varchar("id", { length: 256 }).primaryKey(),
  email: varchar("email", { length: 256 }).notNull(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const decks = createTable("deck", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  icon: iconEnum("icon").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const decksRelations = relations(decks, ({ one, many }) => ({
  owner: one(users, {
    fields: [decks.userId],
    references: [users.id],
  }),
  cards: many(cards),
}));

export const cards = createTable("card", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id")
    .references(() => decks.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  front: varchar("front", { length: 256 }).notNull(),
  back: varchar("back", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cardsRelations = relations(cards, ({ one }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id],
  }),
}));

export const validPosTags = ["NOUN", "VERB", "ADJ"] as const;
export const posTags = pgEnum("pos_tag", validPosTags);

export const vocabItems = createTable("vocab_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  spanish: varchar("spanish", { length: 256 }).notNull(),
  english: varchar("english", { length: 256 }).notNull(),
  posTag: posTags("pos_tag").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const vocabItemAttributeEnum = pgEnum("vocab_item_attribute_key", [
  "english",
  "description",
  "lesson",
]);

export const vocabItemsAttributes = createTable("vocab_item_attribute", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  vocabItemId: uuid("vocab_item_id")
    .references(() => vocabItems.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  type: vocabItemAttributeEnum("type").notNull(),
  key: varchar("key", { length: 512 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
