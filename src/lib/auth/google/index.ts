import { serverEnv } from '@/env/server';
import { Google } from 'arctic';

export const google = new Google(
  serverEnv.OAUTH_GOOGLE_CLIENT_ID,
  serverEnv.OAUTH_GOOGLE_CLIENT_SECRET,
  `${serverEnv.HOST}/sign-in/google/callback`,
);
