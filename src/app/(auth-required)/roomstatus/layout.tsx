import { Header, BackButton, Title } from '@/components/Layout/header';
import DefaultBody from '@/components/Layout/Body/defaultBody';

const topNav = [
  {
    title: '1층',
    path: '/roomstatus/1',
  },
  {
    title: '2층',
    path: '/roomstatus/2',
  },
  {
    title: '3층',
    path: '/roomstatus/3',
  },
  {
    title: '4층',
    path: '/roomstatus/4',
  },
  {
    title: '5층',
    path: '/roomstatus/5',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        title="강의실 현황"
        showBack
        tempBackOnClick="/main"
        topNav={topNav}
      />
      <DefaultBody hasHeader={2}>{children}</DefaultBody>
    </>
  );
}
