// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  /^\/login/,
  /^\/_next/,
  /^\/auth\/.*/,
  /^\/main/,
  /^\/test/,
  /^\/.*\.(?:js|css|png|jpg|svg|ico)$/, // 정적 자산
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(r => r.test(pathname));
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};

export default function middleware(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const access = req.cookies.get('x-access-token')?.value;

  console.log(
    `[MIDDLEWARE] ${req.method} ${pathname} - Access Token: ${
      access ? '존재' : '없음'
    }`
  );

  if (!access && !isPublic(pathname)) {
    // 원래 가려던 경로를 next에 실어 로그인으로
    const loginUrl = new URL('/login', req.url);
    const returnTo = pathname + search;
    loginUrl.searchParams.set('next', returnTo);
    // return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
