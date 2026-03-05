export const TIMETABLE_LENGTH = 36;
export const TIMETABLE_GAP = 2.2;
export const TIMETABLE_WIDTH = 8;
export const MINHOUR = 9;
export const MAXHOUR = 18;

/** 모바일에서 RoomItemDetail 툴팁을 표시하기 위해 꾹 눌러야 하는 시간(ms) */
export const ROOM_ITEM_DETAIL_LONG_PRESS_MS = 500;

export const HOURS = Array.from(
  { length: MAXHOUR - MINHOUR + 1 },
  (_, i) => String(MINHOUR + i).padStart(2, '0')
);
