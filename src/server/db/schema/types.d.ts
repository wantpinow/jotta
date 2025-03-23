import { noteTable } from '@/server/db/schema';

export type Note = typeof noteTable.$inferSelect;
