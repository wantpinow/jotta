import { serverEnv } from '@/env/server';
import { GitHub } from 'arctic';

export const github = new GitHub(
  serverEnv.OAUTH_GITHUB_CLIENT_ID,
  serverEnv.OAUTH_GITHUB_CLIENT_SECRET,
  `${serverEnv.HOST}/sign-in/github/callback`,
);
