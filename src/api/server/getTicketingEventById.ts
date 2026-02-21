/**
 * 서버에서 티켓팅 이벤트 상세 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';
import type { TicketEvent } from '@/types/snackEvent';

interface TicketingEventDetailApiResponse {
  success?: boolean;
  data?: TicketEvent;
}

export async function getTicketingEventById(
  eventId: string | string[]
): Promise<TicketEvent | null> {
  const id = Array.isArray(eventId) ? eventId[0] : String(eventId ?? '');
  if (!id) return null;
  try {
    const res = await serverFetch<TicketingEventDetailApiResponse>(
      `/ticketing/event/${id}`
    );
    return res.data ?? null;
  } catch {
    return null;
  }
}
