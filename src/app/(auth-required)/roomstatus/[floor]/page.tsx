import FloorPage from '@/features/roomstatus/pages/FloorPage';
import { getRoomStatus } from '@/api/server';

interface PageProps {
  params: Promise<{ floor: string }>;
}

export default async function RoomStatusFloorRoutePage({ params }: PageProps) {
  const { floor } = await params;
  const initialRoomStatus = await getRoomStatus();

  return (
    <FloorPage
      floorParam={floor}
      initialRoomStatus={initialRoomStatus}
    />
  );
}
