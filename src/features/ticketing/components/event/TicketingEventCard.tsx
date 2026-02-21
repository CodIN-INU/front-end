'use client';

import type { SnackEvent } from '@/types/snackEvent';
import { convertToKoreanDate } from '@/lib/utils/convertToKoreanDate';

interface TicketingEventCardProps {
  snack: SnackEvent;
  onClick: () => void;
}

const CARD_CLASS =
  'relative rounded-[15px] py-[29px] flex flex-col shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] cursor-pointer';
const OVERLAY_CLASS =
  'absolute inset-0 bg-[rgba(0,0,0,0.18)] rounded-[15px] z-20 cursor-not-allowed';

/** 티켓팅 이벤트 카드 한 개 */
export function TicketingEventCard({ snack, onClick }: TicketingEventCardProps) {
  const isEnded = snack.eventStatus === 'ENDED';

  return (
    <div
      className={CARD_CLASS}
      onClick={isEnded ? undefined : onClick}
      onKeyDown={e => {
        if (!isEnded && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      {...(!isEnded && { role: 'button' as const, tabIndex: 0 })}
    >
      {isEnded && <div className={OVERLAY_CLASS} aria-hidden />}
      <div className="flex flex-col items-center px-4">
        <div className="flex items-start mb-[13px] w-full">
          <p className="font-bold text-[14px]">{snack.eventTitle}</p>
          <p className="text-[25px] text-[#0D99FF] mt-[-17px]">•</p>
        </div>
        <div className="flex flex-row justify-center items-start w-full">
          <div className="flex flex-col justify-start w-full">
            <div className="mt-[5px] text-[12px] text-black">
              <span className="font-semibold">일시:</span>{' '}
              {convertToKoreanDate(snack.eventEndTime || '')}
            </div>
            <div className="text-[12px] text-black">
              <span className="font-semibold">장소:</span> {snack.locationInfo}
            </div>
            <div className="text-[12px] text-black">
              <span className="font-semibold">수량:</span> {snack.quantity}
            </div>
            <div className="text-[12px] text-[#0D99FF]">
              <span className="font-semibold">티켓팅 시작 시간:</span>{' '}
              {convertToKoreanDate(snack.eventTime || '')}
            </div>
          </div>
          <img
            src={snack.eventImageUrl}
            alt=""
            className="w-[93px] h-[93px] border border-1 border-[#d4d4d4] rounded-[10px] p-2 ml-[23px]"
          />
        </div>
      </div>
    </div>
  );
}
