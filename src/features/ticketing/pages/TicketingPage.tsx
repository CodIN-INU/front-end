'use client';

import { FC, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { boardData } from '@/data/boardData';
import BoardLayout from '@/components/Layout/BoardLayout';
import type { SnackEvent } from '@/types/snackEvent';
import { useTicketingEventList } from '@/features/ticketing/hooks/useTicketingEventList';
import { TicketingEventList } from '@/features/ticketing/components/event';

interface TicketingPageProps {
  initialEvents?: SnackEvent[];
  initialNextPage?: number;
}

const TicketingPage: FC<TicketingPageProps> = ({
  initialEvents = [],
  initialNextPage = -1,
}) => {
  const board = boardData['ticketing'];
  const router = useRouter();
  const { tabs } = board;
  const defaultTab = tabs.length > 0 ? tabs[0].value : 'default';

  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const postCategory = useMemo(
    () => tabs.find(tab => tab.value === activeTab)?.postCategory ?? '',
    [tabs, activeTab]
  );

  const defaultCampus = tabs[0]?.postCategory ?? 'SONGDO_CAMPUS';

  const { snacks, isLoading, hasMore, fetchNextPage } = useTicketingEventList(
    postCategory,
    postCategory === defaultCampus ? { initialEvents, initialNextPage } : undefined
  );

  const handleCardClick = useCallback(
    (snack: SnackEvent) => {
      if (snack.eventStatus !== 'ENDED') {
        router.push(`/ticketing/${snack.eventId}`);
      }
    },
    [router]
  );

  return (
    // <BoardLayout
    //   board={board}
    //   activeTab={activeTab}
    //   onTabChange={tab => setActiveTab(tab)}
    //   showSearchButton={false}
    //   backOnClick="/main"
    //   useLayoutHeader
    // >
      <TicketingEventList
        snacks={snacks}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={fetchNextPage}
        onCardClick={handleCardClick}
      />
    // </BoardLayout>
  );
};

export default TicketingPage;
