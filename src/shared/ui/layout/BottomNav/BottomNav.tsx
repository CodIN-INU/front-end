'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HomeIconPath = '/icons/btmNav/Home.svg';
const MessageIconPath = '/icons/btmNav/Message.svg';
const SearchIconPath = '/icons/btmNav/Search.svg';
const UserIconPath = '/icons/btmNav/User.svg';

const ActiveHomeIconPath = '/icons/btmNav/HomeActive.svg';
const ActiveMessageIconPath = '/icons/btmNav/MessageActive.svg';
const ActiveSearchIconPath = '/icons/btmNav/SearchActive.svg';
const ActiveUserIconPath = '/icons/btmNav/UserActive.svg';

interface BottomNavProps {
  activeIndex?: number; // 활성화된 항목의 인덱스, 기본값 설정 가능
}

export default function BottomNav({ activeIndex = 0 }: BottomNavProps) {
  // if pathname is /boards/*, display nothing
  const pathname = usePathname();
  // if (pathname.startsWith('/boards/')) {
  //   return null;
  // }

  return (
    <nav
      className={clsx(
        'fixed hidden bottom-0 z-[101] bg-white right-0 w-full left-1/2 -translate-x-1/2 max-w-[500px]',
        ''
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
            <img
              src={activeIndex === 0 ? ActiveHomeIconPath : HomeIconPath}
              width={30}
              height={30}
              className="stroke-red-500"
            />
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/boards/top3"
            className="flex justify-center items-center h-full"
          >
            <img
              src={activeIndex === 1 ? ActiveSearchIconPath : SearchIconPath}
              width={30}
              height={30}
            />
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/chat"
            className="flex justify-center items-center h-full"
          >
            <img
              src={activeIndex === 2 ? ActiveMessageIconPath : MessageIconPath}
              width={30}
              height={30}
            />
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/mypage"
            className="flex justify-center items-center h-full"
          >
            <img
              src={activeIndex === 3 ? ActiveUserIconPath : UserIconPath}
              width={30}
              height={30}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

