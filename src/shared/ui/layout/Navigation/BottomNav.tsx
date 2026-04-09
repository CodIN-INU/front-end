'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Home from '@public/icons/btmNav/Home.svg';
import Community from '@public/icons/btmNav/Community.svg';
import Message from '@public/icons/btmNav/Message.svg';
import User from '@public/icons/btmNav/User.svg';
import { useEffect } from 'react';
import clsx from 'clsx';

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');
  // /chatroom/* display none

  const hideOnPaths = ['/chatRoom/', '/boards/', '/vote/'];
  const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

  return (
    <nav
      className={clsx(
        shouldHide
          ? 'hidden'
          : 'fixed px-[20px] bottom-0 z-[101] bg-white right-0 w-full left-1/2 -translate-x-1/2 max-w-[500px]'
      )}
      style={{
        boxShadow: '0px -2px 15px 5px rgba(0, 0, 0, 0.07)', // 얇고 가벼운 그림자
        height: '62px', // 컴팩트한 높이
      }}
    >
      <ul className="flex justify-around items-center h-full">
        <li className="flex-1 text-center">
          <Link
            href="/main"
            className="flex justify-center items-center h-full"
          >
            <Home
              width={30}
              height={30}
              stroke={isActive('/main') ? '#0d99ff' : '#b3b3b3'}
            />
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/boards"
            className="flex justify-center items-center h-full"
          >
            <Community
              width={30}
              height={30}
              stroke={isActive('/boards') ? '#0d99ff' : '#b3b3b3'}
            />
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/chat"
            className="flex justify-center items-center h-full"
          >
            <Message
              width={30}
              height={30}
              stroke={isActive('/chat') ? '#0d99ff' : '#b3b3b3'}
            />
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/mypage"
            className="flex justify-center items-center h-full"
          >
            <User
              width={30}
              height={30}
              stroke={isActive('/mypage') ? '#0d99ff' : '#b3b3b3'}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

