'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CurrentTimePointerProps } from '../types';

const LINE_COLOR = '#FFB300';
const GAP = 6;

function formatKTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? '오전' : '오후';
  const hh = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, '0');
  return `${period} ${hh}:${mm}`;
}

const CurrentTimePointer: React.FC<CurrentTimePointerProps> = ({
  minHour,
  maxHour,
  width,
  height,
  refOfParent,
  setShowNav,
}) => {
  const [now, setNow] = useState(new Date());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const hoursFloat = now.getHours() + now.getMinutes() / 60;
  const range = Math.max(1, maxHour - minHour);
  const inRange = hoursFloat >= minHour && hoursFloat < maxHour;

  const x = useMemo(() => {
    if (!width) return 0;
    if (!inRange) return hoursFloat < minHour ? 0 : width;
    const ratio = (hoursFloat - minHour) / range;
    return Math.max(0, Math.min(width, ratio * width));
  }, [hoursFloat, inRange, minHour, range, width]);

  const onLeftHalf = x < width / 2;
  const timeText = formatKTime(now);

  useEffect(() => {
    const handle = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      if (r.right < 0) setShowNav?.('left');
      else if (r.left > window.innerWidth) setShowNav?.('right');
      else setShowNav?.(null);
    };
    const scroller: any = refOfParent?.current ?? window;
    scroller.addEventListener?.('scroll', handle);
    window.addEventListener('resize', handle);
    handle();
    return () => {
      scroller.removeEventListener?.('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [refOfParent, setShowNav]);

  if (!width || !height) return null;

  return (
    <div ref={wrapRef} className="absolute top-0 z-20" style={{ left: x }}>
      <div
        className="block absolute left-0"
        style={{ width: 1, height, background: LINE_COLOR }}
      />
      {onLeftHalf ? (
        <div
          className="flex justify-between absolute w-[66px] -top-[24px] text-[12px] text-[#FFB300] select-none"
          style={{ left: GAP }}
        >
          <span>▼</span>
          <span>{timeText}</span>
        </div>
      ) : (
        <div
          className="flex justify-between absolute w-[66px] -top-[24px] text-[12px] text-[#FFB300] select-none text-right"
          style={{ left: GAP, transform: 'translateX(-100%)' }}
        >
          <span>{timeText}</span>
          <span>▼</span>
        </div>
      )}
    </div>
  );
};

export default CurrentTimePointer;
