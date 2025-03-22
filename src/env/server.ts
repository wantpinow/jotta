import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // next
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string(),
    // postgres
    DATABASE_URL: z.string().url(),
  },
  experimental__runtimeEnv: process.env,
});
