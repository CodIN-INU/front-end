import {
  MAXHOUR,
  MINHOUR,
  TIMETABLE_GAP,
  TIMETABLE_LENGTH,
  TIMETABLE_WIDTH,
} from '../constants/timeTableData';

export function getMarginLeft(): number {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const totalMinutes = (currentHour - MINHOUR) * 60 + currentMinute;
  const totalWidth = TIMETABLE_LENGTH * (TIMETABLE_WIDTH + TIMETABLE_GAP);
  const marginLeft =
    (totalWidth / ((MAXHOUR - MINHOUR) * 60)) * totalMinutes;
  return Math.floor(marginLeft);
}
