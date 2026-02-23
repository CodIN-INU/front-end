'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/shared/api/apiClient';
import ShadowBox from '@/components/common/shadowBox';
import { useElementSizeHeight, useElementSizeWidth } from '@/hooks/useElementSize';
import type { LectureDict } from '../types';
import CurrentTimePointer from '../components/CurrentTimePointer';
import RoomItemHourly from '../components/RoomItemHourly';
import { getTimeTableData } from '../utils/getTimeTableData';
import { MAXHOUR, MINHOUR } from '../constants/timeTableData';

const defaultRoomStatus: (LectureDict | null)[] = Array.from(
  { length: 5 },
  () => null
);

interface FloorPageProps {
  floorParam?: string;
  initialRoomStatus?: LectureDict[] | null;
}

export default function FloorPage({
  floorParam: floorParamProp,
  initialRoomStatus,
}: FloorPageProps = {}) {
  const params = useParams();
  const floorParam = floorParamProp ?? params.floor;
  const floorStr = Array.isArray(floorParam) ? floorParam[0] : floorParam;

  const { ref_w, width } = useElementSizeWidth<HTMLDivElement>();
  const { ref_h, height } = useElementSizeHeight<HTMLDivElement>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    !(initialRoomStatus && initialRoomStatus.length > 0)
  );
  const [error, setError] = useState<string | null>(null);
  const [floor, setFloor] = useState<number>(
    floorStr ? Number(floorStr) || 1 : 1
  );
  const [roomStatus, setRoomStatus] = useState<(LectureDict | null)[]>(
    initialRoomStatus && initialRoomStatus.length > 0 ? initialRoomStatus : defaultRoomStatus
  );
  const [showNav, setShowNav] = useState<string | null>(null);

  useEffect(() => {
    if (!floorStr) {
      setFloor(1);
    } else {
      setFloor(Number(floorStr) || 1);
    }
  }, [floorStr]);

  useEffect(() => {
    if (initialRoomStatus && initialRoomStatus.length > 0) return;

    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (typeof window !== 'undefined' && localStorage.getItem('roomStatusUpdatedAt') === day) {
      const rs = JSON.parse(localStorage.getItem('roomStatus') || '[]');
      if (Array.isArray(rs) && rs.length > 0) {
        setRoomStatus(rs);
        setIsLoading(false);
      }
      return;
    }

    const fetchRoomStatus = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/rooms/empty');
        const la: LectureDict[] = response.data?.data ?? response.data ?? [];
        if (typeof window !== 'undefined' && la.length > 0) {
          localStorage.setItem('roomStatus', JSON.stringify(la));
          localStorage.setItem('roomStatusUpdatedAt', day);
        }
        setRoomStatus(la);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomStatus();
  }, [initialRoomStatus]);

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <div className="mt-[150px] px-0 flex justify-center">
          <p>강의실 정보를 불러오는 중이에요...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full">
        <div className="mt-[132px] px-0 flex justify-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div ref={ref_w} className="mx-[7px]" />

      <div
        ref={ref_h}
        id="scrollbar-hidden"
        className="relative flex flex-col gap-[21px]"
      >
        <CurrentTimePointer
          minHour={MINHOUR}
          maxHour={MAXHOUR}
          width={width}
          height={height}
          refOfParent={scrollRef}
          setShowNav={setShowNav}
        />

        {roomStatus[floor - 1] &&
          Object.entries(roomStatus[floor - 1]).map(([roomNum, status]) => {
            const [timeTable, boundaryTable] = getTimeTableData(status);
            return (
              <ShadowBox
                key={roomNum}
                className="flex flex-col w-full px-[14px] pt-[17px] pb-[20px]"
              >
                <RoomItemHourly
                  RoomName={roomNum + '호'}
                  LectureList={status}
                  RoomStatusList={timeTable}
                  BoundaryList={boundaryTable}
                />
              </ShadowBox>
            );
          })}
      </div>
    </div>
  );
}
