import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  // 1. Instant root redirect (edge level - zero client JS or spinner overhead)
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/owner/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. /owner root fallback to dashboard
  if (pathname === '/owner' || pathname === '/owner/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/owner/dashboard', request.url));
  }

  // 3. Protected routes: /owner/*
  const protectedRoutes = ['/owner'];
  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Auth routes: redirect already authenticated users straight to dashboard
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  if (authRoutes.some(r => pathname.startsWith(r))) {
    if (token) {
      return NextResponse.redirect(new URL('/owner/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
