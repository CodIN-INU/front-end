/**
 * 서버에서 빈 강의실 현황 조회
 * - getRoomStatus: 메인 등 공통용 (기존) GET /lectures/rooms/empty
 * - getRoomStatusDetail: /roomstatus 페이지용 (건물·층별) GET /lectures/rooms/empty/detail?building=&floor=
 */

import { serverFetch } from './serverFetch';
import type { LectureDict } from '@/features/roomstatus/types';

interface RoomStatusApiResponse {
  success?: boolean;
  data?: LectureDict[];
}

/** 메인 페이지 등: 기존 API (파라미터 없음) */
export async function getRoomStatus(): Promise<LectureDict[] | null> {
  try {
    const res = await serverFetch<RoomStatusApiResponse>('/lectures/rooms/empty');
    const data = res.data;
    if (Array.isArray(data)) {
      return data;
    }
    return null;
  } catch (e) {
    console.error('[getRoomStatus] serverFetch failed', e);
    return null;
  }
}

interface RoomStatusDetailApiResponse {
  success?: boolean;
  data?: LectureDict[] | LectureDict;
}

export interface GetRoomStatusDetailParams {
  building: string;
  floor: string | number;
}

/** /roomstatus 페이지용: 건물·층별 상세 API */
export async function getRoomStatusDetail(
  params: GetRoomStatusDetailParams
): Promise<(LectureDict | null)[] | null> {
  const { building, floor } = params;
  try {
    const res = await serverFetch<RoomStatusDetailApiResponse>(
      `/lectures/rooms/empty/detail?building=${encodeURIComponent(building)}&floor=${encodeURIComponent(String(floor))}`
    );
    const data = res.data;
    if (Array.isArray(data)) {
      // 백엔드가 [{...해당 층 데이터...}] 형태로 줄 수도 있고,
      // 층별 전체 배열을 줄 수도 있으므로 클라이언트와 동일하게 분기 처리
      if (
        data.length === 1 &&
        data[0] &&
        typeof data[0] === 'object' &&
        !Array.isArray(data[0])
      ) {
        const floorNum = Number(floor);
        const idx = floorNum >= 1 && floorNum <= 5 ? floorNum - 1 : 0;
        const arr: (LectureDict | null)[] = [null, null, null, null, null];
        arr[idx] = data[0] as LectureDict;
        return arr;
      }
      return data as (LectureDict | null)[];
    }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const floorNum = Number(floor);
      const idx = floorNum >= 1 && floorNum <= 5 ? floorNum - 1 : 0;
      const arr: (LectureDict | null)[] = [null, null, null, null, null];
      arr[idx] = data as LectureDict;
      return arr;
    }
    return null;
  } catch (e) {
    console.error('[getRoomStatusDetail] serverFetch failed', e);
    return null;
  }
}
