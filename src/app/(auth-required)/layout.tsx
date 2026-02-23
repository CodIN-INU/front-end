/**
 * (auth-required) 라우트 그룹 공통 레이아웃
 * - 로그인 필요 모든 페이지에 BottomNav 적용
 * - URL에 (auth-required)는 포함되지 않음
 * @see docs/APP_STRUCTURE.md
 */
import { ReactNode } from 'react';
import BottomNav from '@/components/Layout/Navigation/BottomNav';

export default function LayoutWithBottomNav({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto w-full flex justify-center">
      {children}
      <BottomNav />
    </div>
  );
}
