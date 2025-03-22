import { NextResponse, type NextRequest } from 'next/server';
import { serverEnv } from './env/server';

export async function middleware(request: NextRequest) {
  // don't allow access to /testing/* when running in production
  if (serverEnv.NODE_ENV === 'production') {
    if (request.nextUrl.pathname.startsWith('/testing')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // don't run middleware for server components
  if (request.headers.get('accept') == 'text/x-component') {
    return NextResponse.next();
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
