'use server';

import { cookies } from 'next/headers';
import { lucia, signOutRedirect } from '@/lib/auth';
import { auth } from '@/lib/auth/validate';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const { session } = await auth();
  if (!session) {
    throw new Error('No session to sign out');
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(signOutRedirect);
};
