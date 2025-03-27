import { generateState, generateCodeVerifier } from 'arctic';
import { cookies } from 'next/headers';
import { signInRedirect } from '@/lib/auth';
import { google } from '@/lib/auth/google';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') ?? signInRedirect;

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authorizationUrl = google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ]);

  // Store the OAuth state and code verifier in cookies
  (await cookies()).set('google_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  (await cookies()).set('google_code_verifier', codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  // Store the redirect URL in cookies
  (await cookies()).set('redirect_url', redirect, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return Response.redirect(authorizationUrl);
}
