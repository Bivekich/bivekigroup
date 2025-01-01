import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Обработка запросов к favicon.ico
  if (request.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/public/favicon.ico', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/favicon.ico'],
};
