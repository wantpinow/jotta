'use server';

import { sha256 } from '@noble/hashes/sha2';

import { emailSignInSchema } from '@/lib/auth/email/validate';
import { db } from '@/server/db';
import { userTable } from '@/server/db/schema';
import { lucia, signUpRedirect } from '@/lib/auth';
import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { redirect as redirectNavigation } from 'next/navigation';
import { z } from 'zod';

export const signUpWithEmail = async (values: z.infer<typeof emailSignInSchema>) => {
  const passwordHash = Buffer.from(sha256(values.password)).toString('base64');

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, values.email),
  });
  if (existingUser !== undefined) {
    throw new Error('Email is already in use');
  }

  const [user] = await db
    .insert(userTable)
    .values({
      email: values.email,
      passwordHash,
    })
    .returning();

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirectNavigation(values.redirect ?? signUpRedirect);
};

export const signInWithEmail = async (values: z.infer<typeof emailSignInSchema>) => {
  const passwordHash = Buffer.from(sha256(values.password)).toString('base64');

  const user = await db.query.userTable.findFirst({
    where: and(
      eq(userTable.email, values.email),
      eq(userTable.passwordHash, passwordHash),
    ),
  });
  if (user === undefined) {
    throw new Error('Incorrect email or password');
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirectNavigation(values.redirect ?? signUpRedirect);
};
