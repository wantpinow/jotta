import { type Config } from 'drizzle-kit';

import { serverEnv } from '@/env/server';
import { PG_TABLE_PREFIX } from '@/server/conf';

export default {
  schema: './src/server/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
  tablesFilter: [`${PG_TABLE_PREFIX}*`],
} satisfies Config;
