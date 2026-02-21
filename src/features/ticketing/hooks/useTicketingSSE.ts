'use client';

import { useEffect, useRef, useState } from 'react';
import { parseServerTimestamp } from '@/features/ticketing/utils/ticketingTime';

/**
 * 티켓팅 실시간 수량 SSE 구독 + 서버 시간 보정
 * @returns serverOffsetMs - 서버 시간 보정값(ms). Date.now() + serverOffsetMs = 서버 현재 시각
 */
export function useTicketingSSE(
  eventId: string,
  onQuantityUpdate: (quantity: number) => void
) {
  const sseRef = useRef<EventSource | null>(null);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const onQuantityRef = useRef(onQuantityUpdate);
  onQuantityRef.current = onQuantityUpdate;

  useEffect(() => {
    if (!eventId) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/ticketing/sse/subscribe/${eventId}`;

    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }

    const es = new EventSource(url, { withCredentials: true });
    sseRef.current = es;

    const onStock = (evt: MessageEvent<string>) => {
      let payload: unknown = evt.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      const data = payload as { timestamp?: string; quantity?: number };

      if (data?.timestamp) {
        const serverMs = parseServerTimestamp(data.timestamp);
        if (serverMs !== null) {
          setServerOffsetMs(serverMs - Date.now());
        }
      }
      if (typeof data?.quantity === 'number') {
        onQuantityRef.current(data.quantity);
      }
    };

    es.addEventListener('ticketing-stock-sse', onStock as EventListener);

    return () => {
      es.removeEventListener('ticketing-stock-sse', onStock as EventListener);
      es.close();
      sseRef.current = null;
    };
  }, [eventId]);

  return serverOffsetMs;
}
