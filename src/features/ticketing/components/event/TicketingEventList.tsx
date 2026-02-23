'use client';

import { useEffect, useRef } from 'react';
import type { SnackEvent } from '@/types/snackEvent';
import { TicketingEventCard } from './TicketingEventCard';

interface TicketingEventListProps {
  snacks: SnackEvent[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onCardClick: (snack: SnackEvent) => void;
}

const SCROLL_THRESHOLD = 300;

/** 티켓팅 이벤트 목록 + 로딩/빈 상태 + 무한 스크롤 */
export function TicketingEventList({
  snacks,
  isLoading,
  hasMore,
  onLoadMore,
  onCardClick,
}: TicketingEventListProps) {
  const loadMoreTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - SCROLL_THRESHOLD &&
        !isLoading &&
        hasMore &&
        !loadMoreTriggered.current
      ) {
        loadMoreTriggered.current = true;
        onLoadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    if (!isLoading) loadMoreTriggered.current = false;
  }, [isLoading]);

  if (isLoading && snacks.length === 0) {
    return (
      <div className="text-center my-4 text-gray-500">로딩중..</div>
    );
  }

  if (!hasMore && !isLoading && snacks.length === 0) {
    return (
      <div className="text-center my-4 text-gray-500">
        등록된 이벤트가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[22px] pb-[29px] w-full">
      {snacks.map(snack => (
        <TicketingEventCard
          key={snack.eventId}
          snack={snack}
          onClick={() => onCardClick(snack)}
        />
      ))}
    </div>
  );
}
