'use client';

import React from 'react';
import TopNav from '@/components/Layout/Navigation/topNav';
import BackButton from './BackButton';
import TitleComp from './Title';
import SearchButton from './SearchButton';
import Menu from '@/components/common/Menu';
import Logo from './Logo';
import Notice from './Notice';
import DownloadButton from './DownloadButton';
import ReloadButton from './ReloadButton';
import { useRouter } from 'next/navigation';

type NavItem = { title: string; path: string };

interface DownloadButtonProps {
  endpoint: string; // 백엔드 API 경로 (예: "/files/report")
  filename?: string; // 저장할 파일 이름
  method?: 'GET' | 'POST';
  body?: any; // POST 시 보낼 데이터
}

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backOnClick?: () => void;
  tempBackOnClick?: string; // 임시 백버튼 함수
  showLogo?: boolean;

  showSearch?: boolean;
  searchOnClick?: () => void;
  MenuItems?: () => React.ReactNode;
  showNotice?: boolean;
  showDownload?: DownloadButtonProps;
  showReload?: boolean;

  topNav?: NavItem[];
  topBarSetCenter?: boolean;

  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  backOnClick = undefined,
  tempBackOnClick = undefined,
  showLogo = false,
  showSearch = false,
  searchOnClick = () => {},
  MenuItems,
  showNotice = false,
  showDownload,
  showReload = false,
  topNav = undefined,
  topBarSetCenter = false,
  className = '',
}) => {
  const router = useRouter();
  return (
    <header
      className={`
       bg-white fixed top-0
        left-1/2 -translate-x-1/2 right-0 z-50 w-full max-w-[500px]
        ${className}
      `}
    >
      <div className="relative flex w-full justify-center bg-white z-[99]">
        <div className="relative flex px-[20px] max-w-[460px] items-center justify-center w-full h-[77px]">
          {/* Left Area */}
          <div className="absolute left-[12px] flex items-center gap-2">
            {showBack ? (
              <BackButton
                onClick={
                  tempBackOnClick
                    ? () => router.push(tempBackOnClick)
                    : backOnClick
                    ? backOnClick
                    : undefined
                }
              />
            ) : null}
            {showLogo ? <Logo /> : null}
          </div>

          {/* Center Area */}
          <div className="flex items-end justify-center pointer-events-none px-4">
            <div className="overflow-hidden whitespace-nowrap text-ellipsis pointer-events-auto text-center">
              {title ? <TitleComp>{title}</TitleComp> : null}
            </div>
          </div>

          {/* Right Area */}
          <div className="absolute right-[12px] flex items-center gap-2">
            {showSearch ? <SearchButton onClick={searchOnClick} /> : null}
            {MenuItems ? (
              <Menu>
                <MenuItems />
              </Menu>
            ) : null}
            {showNotice ? <Notice /> : null}
            {showDownload ? (
              <DownloadButton
                endpoint={showDownload.endpoint}
                filename={showDownload.filename}
                method={showDownload.method}
                body={showDownload.body}
              />
            ) : null}
            {showReload ? <ReloadButton /> : null}
          </div>
        </div>
      </div>

      <TopNav
        nav={topNav}
        setCenter={topBarSetCenter}
      />
    </header>
  );
};

export default Header;
