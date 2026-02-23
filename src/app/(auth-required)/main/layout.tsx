/**
 * 메인 페이지 (/main) 레이아웃
 * - MainHeader: 로고, Notice, TopNav(메인|티켓팅)
 * - headerPadding="full": 160px 상단 패딩 (MainHeader+TopNav 높이)
 */
import { MainHeader } from '@/features/main';
import DefaultBody from '@/components/Layout/Body/defaultBody';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <DefaultBody headerPadding="full">{children}</DefaultBody>
    </>
  );
}
