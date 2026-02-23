/**
 * 티켓팅 목록 (/ticketing) 레이아웃
 * - MainHeader 사용 (메인과 동일)
 * - (list)는 URL에 포함되지 않는 라우트 그룹
 */
import { MainHeader } from '@/features/main';
import DefaultBody from '@/components/Layout/Body/defaultBody';

export default function TicketingListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <DefaultBody headerPadding="full">{children}</DefaultBody>
    </>
  );
}
