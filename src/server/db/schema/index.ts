import { relations, sql } from 'drizzle-orm';
import {
  foreignKey,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { PG_TABLE_PREFIX } from '@/server/conf';

export const createTable = pgTableCreator((name) => `${PG_TABLE_PREFIX}${name}`);

// auth (user and session)
export const userTable = createTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  githubId: text('github_id').unique(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .$onUpdate(() => new Date())
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const sessionTable = createTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [userTable.id],
        name: 'session_user_fkey',
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
    };
  },
);

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

// notes
export const noteTable = createTable(
  'note',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .$onUpdate(() => new Date())
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [userTable.id],
        name: 'note_user_fkey',
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
    };
  },
);

export const noteRelations = relations(noteTable, ({ many }) => ({
  mentions: many(personNoteMentionTable),
}));

// people
export const personTable = createTable(
  'person',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .$onUpdate(() => new Date())
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.userId],
        foreignColumns: [userTable.id],
        name: 'person_user_fkey',
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
    };
  },
);

export const personRelations = relations(personTable, ({ many }) => ({
  mentions: many(personNoteMentionTable),
}));

// person note mentions
export const personNoteMentionTable = createTable(
  'person_note_mention',
  {
    personId: uuid('person_id').notNull(),
    noteId: uuid('note_id').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .$onUpdate(() => new Date())
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.personId, table.noteId] }),
      foreignKey({
        columns: [table.personId],
        foreignColumns: [personTable.id],
        name: 'person_note_mention_person_fkey',
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
      foreignKey({
        columns: [table.noteId],
        foreignColumns: [noteTable.id],
        name: 'person_note_mention_note_fkey',
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
    ];
  },
);

export const personNoteMentionRelations = relations(
  personNoteMentionTable,
  ({ one }) => ({
    person: one(personTable, {
      fields: [personNoteMentionTable.personId],
      references: [personTable.id],
    }),
    note: one(noteTable, {
      fields: [personNoteMentionTable.noteId],
      references: [noteTable.id],
    }),
  }),
);
