'use client';

import React from 'react';
import type { RoomItemProps, Lecture } from '../types';
import { TIMETABLE_GAP } from '../constants/timeTableData';
import clsx from 'clsx';

const BASE_HOUR = 9;
const HOURS_COUNT = 9;
const START_MIN = BASE_HOUR * 60;

const COLORS = {
  m0: '#EBF0F7',
  m15: '#C3E6FF',
  m30: '#92D1FF',
  m45: '#3CADFF',
  m60: '#0D99FF',
} as const;

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
function colorFor(mins: number) {
  if (mins >= 60) return COLORS.m60;
  if (mins >= 45) return COLORS.m45;
  if (mins >= 30) return COLORS.m30;
  if (mins >= 15) return COLORS.m15;
  return COLORS.m0;
}

type HourInfo = {
  totalFilledMin: number;
  dominant?: Lecture | null;
  dispStartMin: number;
  dispEndMin: number;
};

function buildHourInfos(lectures: Lecture[]): HourInfo[] {
  const infos: HourInfo[] = [];
  for (let i = 0; i < HOURS_COUNT; i++) {
    const hourStart = START_MIN + i * 60;
    const hourEnd = hourStart + 60;

    let total = 0;
    let best: { lec: Lecture; mins: number; s: number; e: number } | null = null;

    for (const lt of lectures ?? []) {
      const s = Math.max(hourStart, toMin(lt.startTime));
      const e = Math.min(hourEnd, toMin(lt.endTime));
      const mins = Math.max(0, e - s);
      if (mins > 0) {
        total += mins;
        if (!best || mins > best.mins) best = { lec: lt, mins, s, e };
      }
    }

    infos.push({
      totalFilledMin: Math.min(60, total),
      dominant: best?.lec ?? null,
      dispStartMin: best ? best.s : hourStart,
      dispEndMin: best ? best.e : hourEnd,
    });
  }
  return infos;
}

const RoomItemHourly: React.FC<RoomItemProps> = ({
  RoomName,
  LectureList,
  RoomStatusList: _ignoreA,
  BoundaryList: _ignoreB,
  summaryView = false,
}) => {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const infos = React.useMemo(() => buildHourInfos(LectureList), [LectureList]);

  const labels = [9, 10, 11, 12, 1, 2, 3, 4, 5];

  const open = (i: number) => setActiveIdx(i);
  const close = () => setActiveIdx(null);

  return (
    <div id="scrollbar-hidden" className="flex flex-col gap-[12px]">
      <h3
        className={clsx(
          !summaryView ? 'left-[14px] top-[17px]' : 'top-[9px]',
          'absolute text-[#212121] text-[14px] w-max bg-white z-30 font-medium'
        )}
      >
        {RoomName}
      </h3>

      <div className="mt-[29px]">
        <div className="flex w-full gap-[2px] mb-[6px]">
          {labels.map(n => (
            <p key={n} className="flex-1 shrink-0 text-[#808080] text-[12px]">
              {n}
            </p>
          ))}
        </div>

        <div
          style={{ gap: TIMETABLE_GAP }}
          className="flex w-full gap-[2px] flex-nowrap"
        >
          {infos.map((info, idx) => {
            const hourStart = START_MIN + idx * 60;
            const hourEnd = hourStart + 60;
            const bg = colorFor(info.totalFilledMin);

            const isEmpty = info.totalFilledMin === 0;
            const title = isEmpty
              ? `빈 강의실 · ${fmt(hourStart)}~${fmt(hourEnd)}`
              : `${info.dominant?.lectureNm ?? ''} · ${fmt(info.dispStartMin)}~${fmt(info.dispEndMin)}`;

            return (
              <button
                key={idx}
                id={`room-${RoomName}-hour-${idx}`}
                onClick={() => open(idx)}
                onTouchStart={() => open(idx)}
                onMouseLeave={close}
                style={{
                  backgroundColor: bg,
                }}
                className="relative shrink-0 h-[34px] flex-1 rounded-[5px]"
                title={title}
              >
                {activeIdx === idx && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-[10px] text-white px-[26px] pt-[9px] pb-[12px] text-left z-30"
                    style={{
                      top: '-84px',
                      backgroundColor: 'rgba(17, 17, 17, 0.64)',
                      backdropFilter: 'blur(2px)',
                      minWidth: '100px',
                    }}
                  >
                    <p className="text-[10px] font-bold">
                      {isEmpty ? '빈 강의실' : info.dominant?.lectureNm}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="inline-block w-[6px] h-[6px] rounded-full"
                        style={{ backgroundColor: bg }}
                        aria-hidden
                      />
                      <span className="text-[10px]">
                        {isEmpty
                          ? `${fmt(hourStart)}~${fmt(hourEnd)}`
                          : `${fmt(info.dispStartMin)}~${fmt(info.dispEndMin)}`}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomItemHourly;
