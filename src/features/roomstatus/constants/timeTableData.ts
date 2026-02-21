export const TIMETABLE_LENGTH = 36;
export const TIMETABLE_GAP = 2.2;
export const TIMETABLE_WIDTH = 8;
export const MINHOUR = 9;
export const MAXHOUR = 18;

export const HOURS = Array.from(
  { length: MAXHOUR - MINHOUR + 1 },
  (_, i) => String(MINHOUR + i).padStart(2, '0')
);
