'use client';

import { FC } from 'react';
import SmRoundedBtn from '../buttons/smRoundedBtn';

interface TabsProps<T> {
  tabs: { label: string; value: T }[]; // 탭 목록
  activeTab: T; // 현재 활성화된 탭
  onTabChange: (tab: T) => void; // 탭 변경 함수
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Tabs: FC<TabsProps<any>> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav
      id="scrollbar-hidden"
      className="flex overflow-x-auto no-scrollbar gap-[8px]"
    >
      {tabs.map((tab: any) => (
        <div key={tab.value}>
          <SmRoundedBtn
            text={tab.label}
            status={activeTab === tab.value ? 1 : 0}
            onClick={() => onTabChange(tab.value)}
          />
        </div>
      ))}
    </nav>
  );
};

export default Tabs;

