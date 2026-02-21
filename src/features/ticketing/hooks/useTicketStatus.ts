'use client';

import { useState, useEffect } from 'react';
import type { TicketEvent } from '@/types/snackEvent';
import {
  parseBackendLocalMs,
  calendarDaysLeft,
  DAY_MS,
} from '@/features/ticketing/utils/ticketingTime';

export type TicketStatusType =
  | 'available'
  | 'upcoming'
  | 'countdown'
  | 'closed'
  | 'completed';

export function useTicketStatus(
  eventData: TicketEvent | null,
  serverOffsetMs: number
) {
  const [status, setStatus] = useState<TicketStatusType>('closed');
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [upcomingLabel, setUpcomingLabel] = useState('');

  useEffect(() => {
    if (!eventData) return;

    const update = () => {
      const ticketMs = parseBackendLocalMs(eventData.eventTime);
      if (ticketMs === null) {
        setStatus('closed');
        return;
      }
      const nowMs = Date.now() + serverOffsetMs;
      const diffMs = ticketMs - nowMs;

      if (eventData.eventStatus === 'ENDED') {
        setStatus('closed');
        setUpcomingLabel('');
        return;
      }
      if (diffMs <= 0 && !eventData.userParticipatedInEvent) {
        setStatus('available');
        setRemainingTime('00:00');
        setUpcomingLabel('');
        return;
      }
      if (diffMs <= 0 && eventData.userParticipatedInEvent) {
        setStatus('completed');
        setRemainingTime('00:00');
        setUpcomingLabel('');
        return;
      }
      if (diffMs >= DAY_MS) {
        setStatus('upcoming');
        setUpcomingLabel(`오픈 ${calendarDaysLeft(nowMs, ticketMs)}일 전`);
        return;
      }
      if (diffMs > 180_000) {
        setStatus('upcoming');
        const hours = Math.floor(diffMs / 3_600_000);
        const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
        setUpcomingLabel(`오픈 ${hours}시간 ${minutes}분 전`);
        return;
      }
      setStatus('countdown');
      const sec = Math.ceil(diffMs / 1000);
      const mm = String(Math.floor(sec / 60)).padStart(2, '0');
      const ss = String(sec % 60).padStart(2, '0');
      setRemainingTime(`${mm}:${ss}`);
      setUpcomingLabel('');
    };

    update();
    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [eventData, serverOffsetMs]);

  return { status, remainingTime, upcomingLabel };
}
