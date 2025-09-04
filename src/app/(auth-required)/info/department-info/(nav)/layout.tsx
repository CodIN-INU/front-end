import DefaultBody from '@/components/Layout/Body/defaultBody';
import { Header } from '@/components/Layout/header';

const topNav = [
  {
    title: '전화번호부',
    path: '/info/department-info/phone',
  },
  {
    title: '교수님 및 연구실',
    path: '/info/department-info/professor',
  },
  {
    title: '제휴 업체',
    path: '/info/department-info/partners',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        showBack
        title="정보대 소개"
        tempBackOnClick="/main"
        topNav={topNav}
      />
      <DefaultBody hasHeader={2}>{children}</DefaultBody>
    </>
  );
}
