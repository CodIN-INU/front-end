'use client';

import React from 'react';
import type { RoomItemProps, Lecture } from '../types';
import RoomItemDetail from './RoomItemDetail';
import {
  TIMETABLE_GAP,
  TIMETABLE_LENGTH,
  TIMETABLE_WIDTH,
} from '../constants/timeTableData';

const RoomItem: React.FC<RoomItemProps> = ({
  RoomName,
  LectureList,
  RoomStatusList,
  BoundaryList,
}) => {
  const [clicked, setClicked] = React.useState<number>(-1);
  const [activeIndexList, setActiveIndexList] = React.useState<number[]>(
    Array.from({ length: TIMETABLE_LENGTH }, () => 0)
  );
  const [touchedLecture, setTouchedLecture] = React.useState<Lecture | null>(
    null
  );

  const createEmptyLecture = (st: string, et: string): Lecture => {
    return {
      lectureNm: '빈 강의실',
      professor: '',
      roomNum: 0,
      startTime: st,
      endTime: et,
    };
  };

  const selectToucedLecture = (idx: number) => {
    if (RoomStatusList[idx] === 1) {
      for (let lt of LectureList) {
        const [st, et] = [lt.startTime, lt.endTime];
        const startPointer =
          (parseInt(st.split(':')[0]) - 9) * 4 +
          Math.floor(parseInt(st.split(':')[1]) / 15);
        const endPointer =
          (parseInt(et.split(':')[0]) - 9) * 4 +
          Math.ceil(parseInt(et.split(':')[1]) / 15);
        if (startPointer <= idx && idx <= endPointer) {
          setTouchedLecture(lt);
          return;
        }
      }
    } else {
      let emptyStartTime = '09:00';
      let emptyEndTime = '18:00';
      for (let lt of LectureList) {
        const [st, et] = [lt.startTime, lt.endTime];
        const startPointer =
          (parseInt(st.split(':')[0]) - 9) * 4 +
          Math.floor(parseInt(st.split(':')[1]) / 15);

        if (idx < startPointer) {
          emptyEndTime = emptyEndTime > st ? st : emptyEndTime;
        } else {
          emptyStartTime = emptyStartTime < et ? et : emptyStartTime;
        }
      }
      setTouchedLecture(createEmptyLecture(emptyStartTime, emptyEndTime));
      return;
    }

    setTouchedLecture(null);
  };

  const highlightTouchedLecture = (idx: number) => {
    if (idx >= 0) {
      let st = 0;
      let end = TIMETABLE_LENGTH;

      for (let i = idx - 1; i >= 0; i--) {
        if (BoundaryList[i] === 1) {
          st = i;
          break;
        }
      }
      for (let i = idx; i <= TIMETABLE_LENGTH; i++) {
        if (BoundaryList[i] === 1) {
          end = i;
          break;
        }
      }
      let nl = Array.from({ length: TIMETABLE_LENGTH }, () => 0);

      if (RoomStatusList[idx] === 0) {
        [st, end] = [
          st === 0 ? st : st + 1,
          end === TIMETABLE_LENGTH ? end : end - 1,
        ];
      }

      for (let i = st; i <= end; i++) {
        nl[i] = 1;
      }
      setActiveIndexList(nl);
    } else {
      const emptyList = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
      setActiveIndexList(emptyList);
    }
  };

  const onClickTimeLine = (idx: number) => {
    setClicked(idx);
    highlightTouchedLecture(idx);
    selectToucedLecture(idx);
  };

  const getIsActive = (idx: number) => {
    if (idx == 5 && clicked <= 5 && clicked != -1) {
      return true;
    } else if (idx == 28 && clicked >= 28) {
      return true;
    } else {
      return 5 < idx && idx < 28 && clicked === idx ? true : false;
    }
  };

  return (
    <div
      id="scrollbar-hidden"
      className="flex flex-col overflow-x-scroll gap-[12px]"
    >
      <h3 className="text-[#212121] text-[14px] w-max bg-white z-30 font-medium">
        {RoomName}
      </h3>

      <div>
        <div className="flex w-full gap-[4px] mb-[6px]">
          {[9, 10, 11, 12, 1, 2, 3, 4, 5].map(number => (
            <p
              key={number}
              className="flex-1 text-[#808080] font-regular text-[12px]"
            >
              {number}
            </p>
          ))}
        </div>
        <div
          style={{ gap: TIMETABLE_GAP }}
          className={`flex ml-[3px] flex-nowrap `}
        >
          {RoomStatusList.map((status, index) => (
            <button
              key={index}
              id={`room-${RoomName}-time-${index}`}
              onTouchStart={() => onClickTimeLine(index)}
              onTouchEnd={() => onClickTimeLine(-1)}
              style={{
                width: `${TIMETABLE_WIDTH}px`,
                height: `${TIMETABLE_WIDTH * 1.6}px`,
              }}
              className={`relative shrink-0 rounded-[1.8px] ${
                activeIndexList[index]
                  ? RoomStatusList[index] === 1
                    ? 'bg-[#17659c]'
                    : 'bg-[#212121]'
                  : status
                    ? 'bg-[#0D99FF]'
                    : 'bg-[#EBF0F7]'
              }`}
            >
              <RoomItemDetail
                isActive={getIsActive(index)}
                lecture={touchedLecture}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
