'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/shared/api/apiClient';
import ShadowBox from '@/components/common/shadowBox';
import { useElementSizeHeight, useElementSizeWidth } from '@/hooks/useElementSize';
import type { LectureDict } from '../types';
import CurrentTimePointer from '../components/CurrentTimePointer';
import RoomItemHourly from '../components/RoomItemHourly';
import { getTimeTableData } from '../utils/getTimeTableData';
import { MAXHOUR, MINHOUR } from '../constants/timeTableData';
import {
  ROOM_BUILDING_OPTIONS,
  ROOM_FLOOR_OPTIONS,
  DEFAULT_BUILDING,
} from '../constants/buildings';

const defaultRoomStatus: (LectureDict | null)[] = Array.from(
  { length: 5 },
  () => null
);

interface FloorPageProps {
  floorParam?: string;
  building?: string;
  initialRoomStatus?: LectureDict[] | null;
}

export default function FloorPage({
  floorParam: floorParamProp,
  building = DEFAULT_BUILDING,
  initialRoomStatus,
}: FloorPageProps = {}) {
  const router = useRouter();
  const params = useParams();
  const floorParam = floorParamProp ?? params.floor;
  const floorStr = Array.isArray(floorParam) ? floorParam[0] : floorParam;

  const { ref_w, width } = useElementSizeWidth<HTMLDivElement>();

  const handleBuildingChange = (value: string) => {
    const floorSegment = floorStr ?? '1';
    router.push(`/roomstatus/${floorSegment}?building=${encodeURIComponent(value)}`);
  };
  const handleFloorChange = (value: string) => {
    const floorSegment = value === '0' ? '1' : value;
    router.push(`/roomstatus/${floorSegment}?building=${encodeURIComponent(building)}`);
  };
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
        const floorNum = floorStr ? Number(floorStr) || 1 : 1;
        const response = await apiClient.get(
          `/lectures/rooms/empty/detail?building=${encodeURIComponent(building)}&floor=${encodeURIComponent(floorNum)}`
        );
        const raw = response.data?.data ?? response.data;
        let la: (LectureDict | null)[];
        if (Array.isArray(raw)) {
          la = raw;
        } else if (raw && typeof raw === 'object') {
          const arr: (LectureDict | null)[] = [null, null, null, null, null];
          arr[floorNum - 1] = raw as LectureDict;
          la = arr;
        } else {
          la = defaultRoomStatus;
        }
        if (typeof window !== 'undefined' && la.length > 0) {
          localStorage.setItem('roomStatus', JSON.stringify(la));
          localStorage.setItem('roomStatusUpdatedAt', day);
        }
        setRoomStatus(la);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomStatus();
  }, [initialRoomStatus, building, floorStr]);

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

  const floorSelectValue = floorStr ?? '1';

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col px-4 pb-4">
        <p className="text-lg font-bold text-[#212121]">빈 강의실을 찾을</p>
        <p className="mt-1 text-lg font-bold text-[#111827]">
          건물명과 층을 선택해 주세요
        </p>
        <div className="mt-5 flex flex-row gap-3 sm:flex-row sm:gap-4 border-b border-[#000000]">
          <div className="flex flex-1 flex-col gap-1">
            <select
              id="room-building"
              value={building}
              onChange={(e) => handleBuildingChange(e.target.value)}
              className="h-11 w-full rounded-lg  bg-white px-3 text-sm font-medium text-[#111827] outline-none">
              {ROOM_BUILDING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <select
              id="room-floor"
              value={floorSelectValue}
              onChange={(e) => handleFloorChange(e.target.value)}
              className="h-11 w-full rounded-lg  bg-white px-3 text-sm font-medium text-[#111827] outline-none"
            >
              {ROOM_FLOOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
          Object.entries(roomStatus[floor - 1] ?? {}).map(([roomNum, status]) => {
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
