'use client';

import BackButton from '@/components/Layout/header/BackButton';
import MapLinkButton from '@/components/Layout/header/MapLinkButton';
import { Tags, OtherTag } from './tag';
import { useState } from 'react';
import { Tag } from '@/types/partners';

interface BottomSheetProps {
  title: string;
  tags: Tag[];
  duration: [start: Date, end: Date];
  timeDescription: string;
  benefits: string[];
  img: string[];
}

export default function BottomSheet({
  title,
  tags,
  duration,
  timeDescription,
  benefits,
  img,
}: BottomSheetProps) {
  const [sheetHeight, setSheetHeight] = useState(60);
  const [isTransition, setIsTransition] = useState(false);

  // percentage of the screen height
  const minHeight = 20;
  const defaultHeight = 60;
  const maxHeight = 90;

  interface PointerEventWithButtons extends React.PointerEvent<HTMLDivElement> {
    buttons: number;
  }

  const detectLeftMouse = (e: PointerEventWithButtons): boolean => {
    if ('buttons' in e) {
      return e.buttons === 1; // Modern browsers
    }
    return false; // Legacy browsers fallback
  };

  const dragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!detectLeftMouse(e)) {
      return; // Only allow dragging with the left mouse button
    }

    let startY = e.clientY;
    let initialHeight: number;

    document.onpointermove = dragMove;
    function dragMove(e: PointerEvent) {
      const delta: number = startY - e.clientY;
      initialHeight = sheetHeight + (delta / window.innerHeight) * 100;
      setSheetHeight(Math.max(minHeight, Math.min(initialHeight, maxHeight)));
    }

    document.onpointerup = dragEnd;
    function dragEnd() {
      document.onpointermove = null;
      document.onpointerup = null;

      setIsTransition(true);

      // Set a minimum height of 200px
      if (initialHeight < 35) {
        // initialHeight = 200;
        setSheetHeight(minHeight);
      } else if (initialHeight < 75) {
        // initialHeight = 595;
        setSheetHeight(defaultHeight);
      } else {
        setSheetHeight(maxHeight);
      }

      setTimeout(() => {
        setIsTransition(false);
      }, 300);
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[25px] shadow-xl pb-[62px]`}
      style={{
        height: `${sheetHeight}%`,
        transition: isTransition ? 'height 0.2s ease' : 'none',
        // on Mobile
        touchAction: 'none',
        msTouchAction: 'none',
      }}
    >
      <div className="flex justify-center">
        <div
          className="cursor-grab"
          onPointerDown={dragStart}
        >
          <div className="bg-[#D0D9E4] w-[82px] h-[6px] rounded-[15px] my-[12px]" />
        </div>
      </div>
      <div className="p-[18px] mb-[30px]">
        <div className="flex items-center justify-between">
          <BackButton />
          <h2 className="text-Mm font-bold">{title}</h2>
          <MapLinkButton />
        </div>
        <div className="mt-[12px] ml-[6px]">
          <div className="flex gap-[3px] w-full justify-center items-center">
            <OtherTag tags={tags} />
            {tags.map((tag, index) => (
              <Tags
                key={index}
                tag={tag}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[15px] px-[12px]">
          <div>
            <div className="border-b bg-[#D4D4D] w-full mt-[24px] mb-[12px]" />
            <h2 className="text-Mm mb-[6px]">제휴기간</h2>
            <div className="text-Mr text-sub">
              {/* 2025.03 ~ 2026.03 (1학기 시작 전까지) */}
              {duration[0].toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
              })}{' '}
              ~{' '}
              {duration[1].toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
              })}
              ({timeDescription})
            </div>
          </div>
          <div>
            <h2 className="text-Mm mb-[6px]">혜택</h2>
            <ul className="list-disc pl-[18px] text-Mr text-sub">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-[37px]">
          <div
            id="scrollbar-hidden"
            className="flex bg-white p-[18px] gap-[11px] rounded-[15px] overflow-x-scroll shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)]"
          >
            {img.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`제휴 이미지 ${index + 1}`}
                className="w-[133px] min-w-[133px] aspect-square rounded-[15px] object-cover"
              />
            ))}
          </div>
          <div className="text-center text-sr text-[#BFBFBF] mt-[17px]">
            업체에서 게시한 홍보 전단지입니다
          </div>
        </div>
      </div>
    </div>
  );
}
