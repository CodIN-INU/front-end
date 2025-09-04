// /components/BoardLayout.tsx

'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Tabs from '@/components/Layout/Tabs';
import { boardData } from '@/data/boardData'; // boardData 불러오기
import Header from './header/Header';
import DefaultBody from './Body/defaultBody';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import SmRoundedBtn from '../buttons/smRoundedBtn';

interface BoardLayoutProps extends PropsWithChildren {
  board: any;
  activeTab: string;
  onTabChange: (tabValue: string) => void;
  showSearchButton?: boolean; // SearchButton 표시 여부 props 추가
  showReloadButton?: boolean;
}

const BoardLayout: FC<BoardLayoutProps> = ({
  board,
  activeTab,
  onTabChange,
  children,
  showSearchButton = true, // 기본값 true
  showReloadButton = false,
}) => {
  const router = useRouter();
  const { name, icon, tabs, backLink } = board;
  const hasTabs = tabs.length > 0;

  useEffect(() => {
    console.log('BoardLayout: board', board);
  }, [activeTab]);



  return (
    <>
      {/* 고정 헤더 */}
      <Header
        title={name}
        showBack
        backOnClick={()=>router.push('/main')}
        showReload={showReloadButton}
        showSearch
        searchOnClick={()=>router.push('/search')}
      />

      <DefaultBody hasHeader={1}>
        {/* Tabs Section */}
        {hasTabs && (
          <div
            id="scrollbar-hidden"
            className="w-full bg-white z-50 overflow-x-scroll fixed pb-[8px] pr-[40px] mt-[-3px]"
          >
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </div>
        )}
        <div className="pb-[12px] opacity-0">
          <SmRoundedBtn
            status={1}
            text=""
          />
        </div>

        {/* children 영역: 게시물 리스트, 로딩, 페이지네이션, 글쓰기 버튼 등 */}
        {children}
      </DefaultBody>
      <BottomNav />
    </>
  );
};

export default BoardLayout;
