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
