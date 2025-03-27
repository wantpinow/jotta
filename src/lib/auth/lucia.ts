import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/server/db';
import { sessionTable, userTable } from '@/server/db/schema';
import { AuthMethod, DatabaseUserAttributes } from '@/lib/auth';
import { LOCAL_DEV } from '@/server/conf';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.githubId,
      googleId: attributes.googleId,
      email: attributes.email,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      image: attributes.image,
      admin: attributes.admin,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const ALLOWED_AUTH_METHODS: AuthMethod[] = ['github', 'google'];
if (LOCAL_DEV) {
  ALLOWED_AUTH_METHODS.push('email');
}
