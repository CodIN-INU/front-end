'use client';

import ShadowBox from '@/components/common/shadowBox';
import NeedHelp from '@public/icons/need-help.svg';
import Communicate from '@public/icons/communicate.svg';
import Vote from '@public/icons/vote.svg';
import { BoardLinkCard } from './BoardLinkCard';

const BOARD_LINKS = [
  {
    href: '/boards/need-help',
    icon: <NeedHelp />,
    title: '구해요 게시판',
    description:
      '프로젝트 팀원, 스터디, 소모임 무엇이든 구해요에서 구해요!',
  },
  {
    href: '/boards/communicate',
    icon: <Communicate />,
    title: '소통해요 게시판',
    description:
      '졸업생, 선배님, 후배님, 학우님! 꿀팁, 질문 소통해요!',
  },
  {
    href: '/vote',
    icon: <Vote />,
    title: '익명 투표 게시판',
    description:
      '솔직한 학우들의 의견이 궁금할 땐? 익명투표 게시판!',
  },
] as const;

export function BoardLinkSection() {
  return (
    <ShadowBox className="px-[15px] py-[1px] mt-[70px]">
      {BOARD_LINKS.map((link, index) => (
        <span key={link.href}>
          {index > 0 && <hr />}
          <BoardLinkCard
            href={link.href}
            icon={link.icon}
            title={link.title}
            description={link.description}
          />
        </span>
      ))}
    </ShadowBox>
  );
}
