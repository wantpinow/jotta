import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { google } from '@/lib/auth/google';
import { signInPath, signInRedirect } from '@/lib/auth';
import { lucia } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { userTable } from '@/server/db/schema';

export async function GET(request: Request): Promise<Response> {
  // parse the query parameters
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = (await cookies()).get('google_oauth_state')?.value ?? null;
  const storedCodeVerifier = (await cookies()).get('google_code_verifier')?.value ?? null;

  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // get the redirect URL from the cookies
    const redirectUrl = (await cookies()).get('redirect_url')?.value ?? signInRedirect;

    // validate the code and exchange it for tokens
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

    // Get the user info from Google
    const userInfoResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      },
    );

    const googleUser: GoogleUser = await userInfoResponse.json();

    // check if the user already exists with the same google id, sign them in if they do
    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.googleId, googleUser.sub),
    });
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    }

    // check if a user already exists with the same email, redirect to sign in with error if they do
    const existingUserWithEmail = await db.query.userTable.findFirst({
      where: eq(userTable.email, googleUser.email),
    });
    if (existingUserWithEmail) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${signInPath}?error=existing_email`,
        },
      });
    }

    // create a new user
    const [user] = await db
      .insert(userTable)
      .values({
        googleId: googleUser.sub,
        email: googleUser.email,
        firstName: googleUser.given_name || null,
        lastName: googleUser.family_name || null,
        image: googleUser.picture,
      })
      .returning();

    if (!user) {
      return new Response(null, {
        status: 500,
      });
    }

    // create a session for the new user
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // redirect to the signed in page
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GoogleUser {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}
