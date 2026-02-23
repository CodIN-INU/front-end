'use client';

import React from 'react';
import '@/styles/globals.css';
import type { HeaderPaddingType } from '@/constants/layout';

interface DefaultBodyProps {
  /** 상단 패딩: none(0) | compact(80px) | full(160px) */
  headerPadding?: HeaderPaddingType | 'none' | 'compact' | 'full';
  children?: React.ReactNode;
}

const PADDING_CLASS: Record<string, string> = {
  none: '',
  compact: 'pt-[80px]',
  full: 'pt-[160px]',
};

const DefaultBody: React.FC<DefaultBodyProps> = ({
  headerPadding = 'none',
  children,
}) => {
  const pt = PADDING_CLASS[headerPadding] ?? '';

  // useEffect(()=>{
  //     const Postreissue = async (retryCount=0) =>

  //     { if (retryCount < 3) {
  //             console.log(`🔄 재시도 중... (${retryCount + 1}/2)`);

  //             try {
  //                 const res = await PostReissue(); // 토큰 재발급 요청
  //                 console.log(res);

  //             } catch (error) {
  //                 retryCount + 1;

  //             }
  //         }
  //         else{
  //         console.error("❌ 토큰 재발급 실패");

  //             }

  //       }
  //       Postreissue();
  //     }, [])

  return (
    <div
      id="scrollbar-hidden"
      className={'bg-white w-full flex flex-col px-[20px] mb-[110px] ' + pt}
    >
      {children}
    </div>
  );
};

export default DefaultBody;
