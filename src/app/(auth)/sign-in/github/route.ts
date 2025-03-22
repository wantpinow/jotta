import { generateState } from 'arctic';
import { cookies } from 'next/headers';
import { signInRedirect } from '@/lib/auth';
import { github } from '@/lib/auth/github';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') ?? signInRedirect;

  const state = generateState();
  const authorizationUrl = github.createAuthorizationURL(state, []);

  // Store the OAuth state and the redirect URL in cookies
  (await cookies()).set('github_oauth_state', state, {
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
