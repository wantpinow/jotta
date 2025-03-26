'use server';

import { z } from 'zod';
import { authenticatedActionClient } from '@/app/testing/actions/client';

const schema = z.object({
  name: z.string(),
});

export const greetUser = authenticatedActionClient
  .schema(schema)
  .action(async ({ parsedInput: { name } }) => {
    return { message: `Hello ${name}!` };
  });
