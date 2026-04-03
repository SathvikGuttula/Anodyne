import { NextRequest, NextResponse } from 'next/server';
import type { Role } from '@/lib/types';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const role = request.cookies.get('ulcerbridge-role')?.value as Role | undefined;

  if (pathname.startsWith('/patient') && role !== 'patient') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/doctor') && role !== 'doctor') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*'],
};
