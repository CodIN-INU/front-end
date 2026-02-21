'use client';

import React from 'react';
import Logo from '@/components/Layout/header/Logo';
import Notice from '@/components/Layout/header/Notice';
import TopNav from '@/components/Layout/Navigation/topNav';
import { useAuth } from '@/store/userStore';

const Header = () => {
  const user = useAuth(s => s.user);

  const mainNav = [
    {
      title: '메인페이지',
      path: '/main',
    },
    {
      title: '간식나눔 티켓팅',
      path: user?.userRole === 'MANAGER' ? '/admin/ticketing' : '/ticketing',
    },
  ];

  return (
    <header
      className="bg-white fixed top-0
                left-1/2 -translate-x-1/2 right-0 z-[101]
                w-full max-w-[500px]
            "
    >
      {/* 중앙 영역: Title (항상 중앙 고정) */}
      <div
        className="relative flex px-[20px] bg-white items-center
                  justify-center w-full h-[77px] z-[99]"
      >
        <div
          className="
          flex justify-center
          pointer-events-none
          px-4
        "
        >
          <div>
            <Logo />
          </div>
        </div>

        {/* 오른쪽 영역: SearchButton, Menu */}
        <div className="absolute right-[20px] flex items-center gap-2">
          <Notice />
        </div>
      </div>
      <TopNav nav={mainNav} />
    </header>
  );
};

export default Header;
