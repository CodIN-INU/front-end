/**
 * 서버에서 빈 강의실 현황 조회 (메인/강의실 페이지 SSR용)
 */

import { serverFetch } from './serverFetch';
import type { LectureDict } from '@/features/roomstatus/types';

interface RoomStatusApiResponse {
  success?: boolean;
  data?: LectureDict[];
}

export async function getRoomStatus(): Promise<LectureDict[] | null> {
  try {
    const res = await serverFetch<RoomStatusApiResponse>('/rooms/empty');
    const data = res.data;
    if (Array.isArray(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
