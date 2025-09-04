'use client';

import DefaultBody from '@/components/Layout/Body/defaultBody';
import { Header } from '@/components/Layout/header';
import { usePathname } from 'next/navigation';

export default function DeptBoardsHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const param = usePathname();
  const dept = param.split('?dept=')[1] || 'COMPUTER_SCI';

  const topNav = [
    {
      title: '공지사항',
      path: `/dept-boards/notice`,
      params: `?dept=${dept}`,
    },
    {
      title: '자주 묻는 질문',
      path: `/dept-boards/faq`,
      params: `?dept=${dept}`,
    },
    // {
    //   title: '익명의 소리함',
    //   path: `/dept-boards/opinion`,
    //   params: `?dept=${dept}`,
    // },
  ];

  const parsingTitle = (str: string) => {
    switch (str) {
      case 'COMPUTER_SCI':
        return '컴퓨터공학과';
      case 'COMM_INFO':
        return '정보통신공학과';
      case 'EMBEDDED':
        return '임베디드시스템공학과';
    }
    return '컴퓨터공학과';
  };

  return (
    <>
      <Header
        topNav={topNav}
        title={parsingTitle(dept) + ' 게시판'}
        tempBackOnClick="/main/dept"
        topBarSetCenter
        showBack
      />
      <DefaultBody hasHeader={2}>{children}</DefaultBody>
    </>
  );
}
