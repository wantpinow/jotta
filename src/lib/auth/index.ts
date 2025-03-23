import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/server/db';
import { sessionTable, userTable } from '@/server/db/schema';
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
      email: attributes.email,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
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

export interface DatabaseUserAttributes {
  githubId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  admin: boolean;
}

// export type AuthMethod = "email" | "github" | "google";
export type AuthMethod = 'email' | 'github';
export const ALLOWED_AUTH_METHODS: AuthMethod[] = ['github'];
if (LOCAL_DEV) {
  ALLOWED_AUTH_METHODS.push('email');
}

export const signInRedirect = '/home';
export const signUpRedirect = '/home';
export const signOutRedirect = '/';
export const signInPath = '/sign-in';
export const signUpPath = '/sign-up';
