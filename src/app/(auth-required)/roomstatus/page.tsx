import FloorPage from '@/features/roomstatus/pages/FloorPage';
import { getRoomStatusDetail } from '@/api/server';
import { DEFAULT_BUILDING } from '@/features/roomstatus/constants/buildings';
import { Header } from '@/components/Layout/header';

interface PageProps {
  searchParams: Promise<{ building?: string; floor?: string }>;
}

export default async function RoomStatusPage({ searchParams }: PageProps) {
  const { building, floor } = await searchParams;
  const buildingId = building ?? DEFAULT_BUILDING;
  const floorNum = Number(floor ?? '1') || 1;

  const initialRoomStatus = await getRoomStatusDetail({
    building: buildingId,
    floor: floorNum,
  });

  return (
    <>
      <Header title="강의실 현황" showBack tempBackOnClick="/main" />
      <FloorPage
        initialFloor={floorNum}
        building={buildingId}
        initialRoomStatus={initialRoomStatus}
      />
    </>
  );
}

