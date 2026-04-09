/**
 * 서버에서 티켓팅 이벤트 목록 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';
import type { SnackEvent } from '@/types/snackEvent';

interface TicketingEventsApiResponse {
  success?: boolean;
  data?: {
    eventList?: SnackEvent[];
    lastPage?: number;
    nextPage?: number;
  };
}

export interface GetTicketingEventsResult {
  events: SnackEvent[];
  nextPage: number;
}

export async function getTicketingEvents(
  campus: string,
  page: number = 0
): Promise<GetTicketingEventsResult> {
  try {
    const res = await serverFetch<TicketingEventsApiResponse>(
      `/ticketing/event?campus=${encodeURIComponent(campus)}&page=${page}`
    );
    const eventList = res.data?.eventList ?? [];
    const nextPage = res.data?.nextPage ?? -1;
    return {
      events: Array.isArray(eventList) ? eventList : [],
      nextPage,
    };
  } catch {
    return { events: [], nextPage: -1 };
  }
}
