import { serverEnv } from '@/env/server';

export const PG_TABLE_PREFIX = 'jotta_' as const;

export const LOCAL_DEV = serverEnv.NODE_ENV === 'development';
