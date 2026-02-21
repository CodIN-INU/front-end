'use client';

import type { TicketEvent } from '@/types/snackEvent';
import type { TicketStatusType } from '@/features/ticketing/hooks/useTicketStatus';

const BUTTON_BASE =
  'w-full h-[50px] rounded-[5px] text-[18px] font-bold max-w-[500px]';

interface TicketBottomBarProps {
  eventData: TicketEvent;
  ticketStatus: TicketStatusType;
  upcomingLabel: string;
  remainingTime: string;
  onTicketClick: () => void;
}

/** 티켓팅 하단 고정 버튼 영역 */
export function TicketBottomBar({
  eventData,
  ticketStatus,
  upcomingLabel,
  remainingTime,
  onTicketClick,
}: TicketBottomBarProps) {
  return (
    <div className="fixed bottom-[50px] left-0 w-full px-4 bg-white pb-[35px] flex justify-center">
      {ticketStatus === 'available' && eventData.currentQuantity !== 0 && (
        <button
          className={`${BUTTON_BASE} bg-[#0D99FF] text-white`}
          onClick={onTicketClick}
        >
          티켓팅하기
        </button>
      )}

      {ticketStatus === 'upcoming' && (
        <button
          className={`${BUTTON_BASE} border border-[#0D99FF] text-[#0D99FF] bg-white flex items-center justify-center gap-2`}
        >
          {upcomingLabel}
        </button>
      )}

      {ticketStatus === 'countdown' && (
        <button
          className={`${BUTTON_BASE} border border-[#0D99FF] text-[#0D99FF] bg-[#EBF0F7] flex items-center justify-center gap-2`}
        >
          <img src="/icons/timer.svg" alt="timer" />
          <span>{remainingTime}</span>
        </button>
      )}

      {eventData.currentQuantity === 0 &&
        ticketStatus !== 'completed' && (
          <button
            className={`${BUTTON_BASE} bg-[#A6A6AB] text-[#808080]`}
            disabled
          >
            티켓팅 마감
          </button>
        )}

      {ticketStatus === 'completed' && (
        <button
          className={`${BUTTON_BASE} bg-[#0D99FF] text-white`}
          onClick={onTicketClick}
        >
          티켓 확인하기
        </button>
      )}
    </div>
  );
}
