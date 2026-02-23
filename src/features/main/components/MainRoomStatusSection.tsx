'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ShadowBox from '@/components/common/shadowBox';
import RightArrow from '@public/icons/arrow/arrow_right.svg';
import RoomItemHourly from '@/features/roomstatus/components/RoomItemHourly';
import type { LectureDict } from '@/features/roomstatus/types';
import { getTimeTableData } from '@/features/roomstatus/utils/getTimeTableData';
import { fetchClient } from '@/shared/api/fetchClient';
import PageBar from '@/components/Layout/pageBar';

const defaultRoomStatus: (LectureDict | null)[] = Array.from(
  { length: 5 },
  () => null
);

interface MainRoomStatusSectionProps {
  initialRoomStatus?: (LectureDict | null)[] | null;
}

const MainRoomStatusSection = ({
  initialRoomStatus: initial,
}: MainRoomStatusSectionProps) => {
  const [roomStatus, setRoomStatus] = useState<(LectureDict | null)[]>(
    initial && Array.isArray(initial) && initial.length > 0 ? initial : defaultRoomStatus
  );
  const [floor, setFloor] = useState<number>(1);

  useEffect(() => {
    if (initial && Array.isArray(initial) && initial.length > 0) return;
    const fetchMiniRoomStatus = async () => {
      try {
        const response = await fetchClient<{
          success: boolean;
          data?: (LectureDict | null)[];
          message?: string;
        }>('/rooms/empty');
        if (response.success && response.data) {
          setRoomStatus(response.data);
        } else {
          console.error('Failed to fetch room status:', response.message);
        }
      } catch (error) {
        console.error('Error fetching room status:', error);
        window.location.reload();
      }
    };
    fetchMiniRoomStatus();
  }, [initial]);

  const handleFloorChange = useCallback(() => {
    setFloor(prev => (prev === 5 ? 1 : prev + 1));
  }, []);

  return (
    <ShadowBox className="mt-[34px]">
      <div className="flex justify-between pl-[14px] pr-[5px] pt-[23px] pb-[18px] font-bold">
        <div className="text-[16px]">빈 강의실을 찾고 있나요?</div>
        <Link
          href={'/roomstatus/1'}
          className="flex items-center gap-[1px]"
        >
          <span className="text-active text-[12px]">자세히보기</span>
          <RightArrow />
        </Link>
      </div>
      <div className="px-[14px]">
        {roomStatus[floor - 1] &&
          Object.entries(roomStatus[floor - 1] ?? {})
            .slice(0, 2)
            .map(([roomNum, status]) => {
              const [timeTable, boundaryTable] = getTimeTableData(status);
              return (
                <div
                  key={roomNum}
                  className="relative flex flex-col w-full py-[5px]"
                >
                  <RoomItemHourly
                    RoomName={`${roomNum}호`}
                    LectureList={status}
                    RoomStatusList={timeTable}
                    BoundaryList={boundaryTable}
                    summaryView
                  />
                </div>
              );
            })}
      </div>
      <div
        className="flex justify-center py-[22px]"
        onClick={handleFloorChange}
      >
        <PageBar
          value={floor}
          count={5}
        />
      </div>
    </ShadowBox>
  );
};

export default MainRoomStatusSection;
