/**
 * roomstatus feature 전용 타입
 * (CSR→SSR 마이그레이션 시 feature 단위 유지보수용)
 */

import type { RefObject, Dispatch, SetStateAction } from 'react';

export interface Lecture {
  lectureNm: string;
  professor: string;
  roomNum: number;
  startTime: string;
  endTime: string;
}

export interface LectureDict {
  [roomNum: number]: Lecture[];
}

export interface RoomItemProps {
  RoomName: string;
  LectureList: Lecture[];
  RoomStatusList: number[];
  BoundaryList: number[];
  summaryView?: boolean;
}

export interface RoomItemDetailProps {
  isActive: boolean;
  lecture: Lecture | null;
}

export interface CurrentTimePointerProps {
  minHour: number;
  maxHour: number;
  width: number;
  height: number;
  refOfParent: RefObject<HTMLDivElement>;
  setShowNav: Dispatch<SetStateAction<string | null>>;
}
