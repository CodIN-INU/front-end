import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRouteDisabled } from '@/config/features';

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};

export default function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // 비활성 기능 라우트 접근 시 메인으로 리다이렉트
  if (isRouteDisabled(pathname)) {
    return NextResponse.redirect(new URL('/main', req.url));
  }

  return NextResponse.next();
}
