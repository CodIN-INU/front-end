import FloorPage from '@/features/roomstatus/pages/FloorPage';
import { getRoomStatusDetail } from '@/api/server';
import { DEFAULT_BUILDING } from '@/features/roomstatus/constants/buildings';
import { Header } from '@/components/Layout/header';
interface PageProps {
  params: Promise<{ floor: string }>;
  searchParams: Promise<{ building?: string }>;
}

export default async function RoomStatusFloorRoutePage({
  params,
  searchParams,
}: PageProps) {
  const { floor } = await params;
  const { building } = await searchParams;
  const buildingId = building ?? DEFAULT_BUILDING;
  const initialRoomStatus = await getRoomStatusDetail({ building: buildingId, floor });

  return (
    <>
    <Header
      title="강의실 현황"
      showBack
      tempBackOnClick="/roomstatus"
    />
    <FloorPage
      floorParam={floor}
      building={buildingId}
      initialRoomStatus={initialRoomStatus}
    />
    </>
  );
}
