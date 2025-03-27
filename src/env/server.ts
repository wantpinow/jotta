import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // next
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string(),
    // postgres
    DATABASE_URL: z.string().url(),
    // oauth
    OAUTH_GITHUB_CLIENT_ID: z.string().min(1),
    OAUTH_GITHUB_CLIENT_SECRET: z.string().min(1),
    // google oauth
    OAUTH_GOOGLE_CLIENT_ID: z.string().min(1),
    OAUTH_GOOGLE_CLIENT_SECRET: z.string().min(1),
    // openai
    OPENAI_API_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
