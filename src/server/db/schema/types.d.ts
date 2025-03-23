import {
  noteTable,
  personTable,
  personNoteMentionTable,
  userTable,
} from '@/server/db/schema';

export type Note = typeof noteTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
export type Person = typeof personTable.$inferSelect;
export type PersonNoteMention = typeof personNoteMentionTable.$inferSelect;

export type PersonNoteMentionWithPerson = PersonNoteMention & {
  person: Person;
};

export type NoteWithMentions = Note & {
  mentions: PersonNoteMentionWithPerson[];
};
