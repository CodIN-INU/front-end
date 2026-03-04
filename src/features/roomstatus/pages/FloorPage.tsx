'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/shared/api/apiClient';
import ShadowBox from '@/components/common/shadowBox';
import { useElementSizeHeight, useElementSizeWidth } from '@/hooks/useElementSize';
import type { LectureDict } from '../types';
import CurrentTimePointer from '../components/CurrentTimePointer';
import RoomItemHourly from '../components/RoomItemHourly';
import { RoomSelectDropDown } from '../components/RoomSelectDropDown';
import { getTimeTableData } from '../utils/getTimeTableData';
import { MAXHOUR, MINHOUR } from '../constants/timeTableData';
import {
  ROOM_BUILDING_OPTIONS,
  ROOM_FLOOR_OPTIONS,
  DEFAULT_BUILDING,
} from '../constants/buildings';

const defaultRoomStatus: (LectureDict | null)[] = Array.from({ length: 5 }, () => null);

interface FloorPageProps {
  initialFloor?: number;
  building?: string;
  initialRoomStatus?: (LectureDict | null)[] | null;
}

export default function FloorPage({
  initialFloor,
  building = DEFAULT_BUILDING,
  initialRoomStatus,
}: FloorPageProps = {}) {
  const router = useRouter();

  const { ref_w, width } = useElementSizeWidth<HTMLDivElement>();

  const handleBuildingChange = (value: string) => {
    // 건물 변경 시에는 URL 쿼리만 업데이트 (층은 state 기반)
    const params = new URLSearchParams();
    params.set('building', value);
    params.set('floor', String(floor));
    router.push(`/roomstatus?${params.toString()}`);
  };
  const handleFloorChange = (value: string) => {
    const floorNum = value === '0' ? 1 : Number(value) || 1;
    setFloor(floorNum);
  };
  const { ref_h, height } = useElementSizeHeight<HTMLDivElement>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(
    !(initialRoomStatus && initialRoomStatus.length > 0)
  );
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [floor, setFloor] = useState<number>(initialFloor ?? 1);
  const [roomStatus, setRoomStatus] = useState<(LectureDict | null)[]>(
    initialRoomStatus && initialRoomStatus.length > 0 ? initialRoomStatus : defaultRoomStatus
  );
  const [showNav, setShowNav] = useState<string | null>(null);

  useEffect(() => {
    const floorNum = floor;
    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const storageKey = `roomStatus_${building}_${floorNum}_${day}`;

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          const rs = JSON.parse(cached);
          if (Array.isArray(rs) && rs.length > 0) {
            setRoomStatus(rs);
            setIsInitialLoading(false);
            setIsRefetching(false);
            return;
          }
        } catch {
          // ignore broken cache
        }
      }
    }

    const fetchRoomStatus = async () => {
      const hasAnyRooms = roomStatus.some((floorData) => {
        return (
          floorData &&
          typeof floorData === 'object' &&
          Object.keys(floorData ?? {}).length > 0
        );
      });

      if (!hasAnyRooms) {
        setIsInitialLoading(true); // 앱 전체에서 처음 로딩할 때만 전체 로딩 화면
      } else {
        setIsRefetching(true); // 이후에는 기존 화면 유지 + 백그라운드 refetch
      }
      try {
        const response = await apiClient.get(
          `/lectures/rooms/empty/detail?building=${encodeURIComponent(building)}&floor=${encodeURIComponent(floorNum)}`
        );
        const raw = response.data?.data ?? response.data;
        let la: (LectureDict | null)[];
        if (Array.isArray(raw)) {
          // 백엔드가 [{...해당 층 데이터...}] 형태로 줄 수도 있고,
          // 층별 전체 배열을 줄 수도 있으므로 분기 처리
          if (
            raw.length === 1 &&
            raw[0] &&
            typeof raw[0] === 'object' &&
            !Array.isArray(raw[0])
          ) {
            const arr: (LectureDict | null)[] = [null, null, null, null, null];
            arr[floorNum - 1] = raw[0] as LectureDict;
            la = arr;
          } else {
            la = raw as (LectureDict | null)[];
          }
        } else if (raw && typeof raw === 'object') {
          const arr: (LectureDict | null)[] = [null, null, null, null, null];
          arr[floorNum - 1] = raw as LectureDict;
          la = arr;
        } else {
          la = defaultRoomStatus;
        }
        if (typeof window !== 'undefined' && la.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(la));
        }
        setRoomStatus(la);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsInitialLoading(false);
        setIsRefetching(false);
      }
    };

    fetchRoomStatus();
  }, [building, floor]);

  if (isInitialLoading) {
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

  const floorSelectValue = String(floor);
  const buildingOption =
    ROOM_BUILDING_OPTIONS.find((o) => o.value === building) ?? ROOM_BUILDING_OPTIONS[0];
  const floorOption =
    ROOM_FLOOR_OPTIONS.find((o) => o.value === floorSelectValue) ?? ROOM_FLOOR_OPTIONS[0];

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col px-4 pb-4">
        <p className="text-lg font-bold text-[#212121]">빈 강의실을 찾을</p>
        <p className="mt-1 text-lg font-bold text-[#111827]">
          건물명과 층을 선택해 주세요
        </p>
        <div className="mt-3 flex flex-row gap-3 sm:flex-row sm:gap-4 border-b border-[#000000] mb-3">
          <div className="flex min-w-0 flex-[2] flex-col gap-1">
            <RoomSelectDropDown
              inputId="room-building"
              value={buildingOption}
              options={ROOM_BUILDING_OPTIONS}
              onChange={handleBuildingChange}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <RoomSelectDropDown
              inputId="room-floor"
              value={floorOption}
              options={ROOM_FLOOR_OPTIONS}
              onChange={handleFloorChange}
            />
          </div>
        </div>
      </div>

      <div ref={ref_w} className="mx-[7px]" />

      <div
        ref={ref_h}
        id="scrollbar-hidden"
        className="relative flex flex-col gap-[21px]"
      >
        {(() => {
          const floorData = roomStatus[floor - 1];
          const hasRooms =
            floorData &&
            typeof floorData === 'object' &&
            Object.keys(floorData).length > 0;

          if (!hasRooms) {
            return (
              <p className="py-8 text-center text-[#6B7280]">
                해당 데이터가 존재하지 않습니다
              </p>
            );
          }

          return (
            <>
              <CurrentTimePointer
                minHour={MINHOUR}
                maxHour={MAXHOUR}
                width={width}
                height={height}
                refOfParent={scrollRef}
                setShowNav={setShowNav}
              />
              {Object.entries(floorData ?? {}).map(([roomNum, status]) => {
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
            </>
          );
        })()}
      </div>
    </div>
  );
}
