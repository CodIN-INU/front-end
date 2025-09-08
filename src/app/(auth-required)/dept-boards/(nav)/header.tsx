'use client';

import DefaultBody from '@/components/Layout/Body/defaultBody';
import { Header } from '@/components/Layout/header';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DeptBoardsHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const param = useSearchParams();
  const dept = param.get('dept') || 'COMPUTER_SCI';

  const [deptState, setDeptState] = useState(dept);

  const topNav = [
    {
      title: '공지사항',
      path: `/dept-boards/notice`,
      params: `?dept=${deptState}`,
    },
    {
      title: '자주 묻는 질문',
      path: `/dept-boards/faq`,
      params: `?dept=${deptState}`,
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

  useEffect(() => {
    console.log('dept changed:', dept);
    setDeptState(dept);
  }, [dept]);

  return (
    <>
      <Header
        topNav={topNav}
        title={parsingTitle(deptState) + ' 게시판'}
        tempBackOnClick="/main/dept"
        topBarSetCenter
        showBack
      />
      <DefaultBody hasHeader={2}>{children}</DefaultBody>
    </>
  );
}
