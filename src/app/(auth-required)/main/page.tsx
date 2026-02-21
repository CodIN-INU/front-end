import { Suspense } from 'react';
import MainPage from '@/features/main/pages/MainPage';
import MainRoomStatusSection from '@/features/main/components/MainRoomStatusSection';
import MainRankingSection from '@/features/main/components/MainRankingSection';
import { getTopPosts, getRoomStatus } from '@/api/server';
import MainLoading from './loading';

async function MainPageWithData() {
  const [rankingPosts, roomStatus] = await Promise.all([
    getTopPosts(),
    getRoomStatus(),
  ]);

  return (
    <MainPage
      belowFoldContent={
        <>
          <MainRoomStatusSection initialRoomStatus={roomStatus ?? undefined} />
          <MainRankingSection initialRankingPosts={rankingPosts} />
        </>
      }
    />
  );
}

export default function MainRoutePage() {
  return (
    <Suspense fallback={<MainLoading />}>
      <MainPageWithData />
    </Suspense>
  );
}
