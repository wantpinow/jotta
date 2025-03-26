'use server';

import { sha256 } from '@noble/hashes/sha2';

import { emailSignInSchema } from '@/lib/auth/email/validate';
import { db } from '@/server/db';
import { userTable } from '@/server/db/schema';
import { lucia } from '@/lib/auth/lucia';
import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { ActionError, publicAction } from '@/server/actions/safe-action';

export const signInWithEmail = publicAction
  .schema(emailSignInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const passwordHash = Buffer.from(sha256(password)).toString('base64');

    const user = await db.query.userTable.findFirst({
      where: and(eq(userTable.email, email), eq(userTable.passwordHash, passwordHash)),
    });
    if (user === undefined) {
      throw new ActionError('Incorrect email or password');
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return true;
  });
