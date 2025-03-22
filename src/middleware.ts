import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
