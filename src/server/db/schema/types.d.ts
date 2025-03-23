import { noteTable } from '@/server/db/schema';
import { userTable } from '@/server/db/schema';

export type Note = typeof noteTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
