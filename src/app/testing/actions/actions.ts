'use server';

import { z } from 'zod';
import { authenticatedActionClient } from './client';
import { db } from '@/server/db';

const schema = z.object({
  name: z.string(),
});

export const greetUser = authenticatedActionClient
  .schema(schema)
  .action(async ({ parsedInput: { name } }) => {
    const foo = await db.query.userTable.findMany();
    return { message: `Hello ${name}!` };
  });
