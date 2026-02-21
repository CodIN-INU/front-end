import type { Lecture } from '../types';
import { HOURS, TIMETABLE_LENGTH } from '../constants/timeTableData';

export function getTimeTableData(listOfLecture: Lecture[]): readonly [number[], number[]] {
  const timeTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
  const boundaryTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);

  for (const lecture of listOfLecture) {
    const [startH, startM] = lecture.startTime.split(':').map(Number);
    const [endH, endM] = lecture.endTime.split(':').map(Number);

    const startPointer = HOURS.indexOf(String(startH).padStart(2, '0'));
    const endPointer = HOURS.indexOf(String(endH).padStart(2, '0'));

    let boundary = 0;
    if (startPointer >= 0 && endPointer < HOURS.length) {
      for (let i = startPointer; i <= endPointer; i++) {
        for (let j = 0; j <= 4; j++) {
          if (i > startPointer && i < endPointer) {
            timeTable[i * 4 + j] = 1;
          } else if (i === startPointer && j * 15 >= startM) {
            if (boundary === 0) {
              boundaryTable[i * 4 + j] = 1;
              boundary = 1;
            }
            timeTable[i * 4 + j] = 1;
          } else if (i === endPointer && j * 15 <= endM) {
            timeTable[i * 4 + j] = 1;
          } else if (boundary === 1) {
            boundaryTable[i * 4 + j - 1] = 1;
            boundary = 0;
            break;
          }
        }
      }
      if (boundary === 1) {
        boundaryTable[endPointer * 4 + 4] = 1;
      }
    }
  }

  return [timeTable, boundaryTable];
}
