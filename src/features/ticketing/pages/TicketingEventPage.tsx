'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useCallback } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/features/ticketing/components/modals/UserInfoModal';
import { EventDetailContent, TicketBottomBar } from '@/features/ticketing/components/event';
import { fetchClient } from '@/api/clients/fetchClient';
import { FetchSnackDetailResponse, TicketEvent } from '@/types/snackEvent';
import { parseBackendLocalMs } from '@/features/ticketing/utils/ticketingTime';
import { useTicketingSSE } from '@/features/ticketing/hooks/useTicketingSSE';
import { useTicketStatus } from '@/features/ticketing/hooks/useTicketStatus';

interface TicketingEventPageProps {
  eventId?: string;
  initialEvent?: TicketEvent | null;
}

export default function TicketingEventPage({
  eventId: eventIdProp,
  initialEvent,
}: TicketingEventPageProps = {}) {
  const router = useRouter();
  const paramsEventId = useParams().eventId;
  const eventId = eventIdProp ?? (Array.isArray(paramsEventId) ? paramsEventId[0] : paramsEventId);

  const [isInfo, setIsInfo] = useState(initialEvent?.existParticipationData ?? false);
  const [isLoading, setIsLoading] = useState(!initialEvent);
  const [showModal, setShowModal] = useState(initialEvent?.existParticipationData === false);
  const [eventData, setEventData] = useState<TicketEvent | null>(initialEvent ?? null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSelected, setIsSelected] = useState<'info' | 'note'>('info');

  const idStr = Array.isArray(eventId) ? eventId[0] : String(eventId ?? '');

  const handleQuantityUpdate = useCallback((quantity: number) => {
    setEventData(prev =>
      prev ? { ...prev, currentQuantity: quantity } : prev
    );
  }, []);

  const serverOffsetMs = useTicketingSSE(idStr, handleQuantityUpdate);
  const { status: ticketStatus, remainingTime, upcomingLabel } =
    useTicketStatus(eventData, serverOffsetMs);

  useEffect(() => {
    if (!idStr) return;
    if (initialEvent) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClient<FetchSnackDetailResponse>(
          `/ticketing/event/${idStr}`
        );
        setEventData(response.data);
        setIsInfo(response.data.existParticipationData);
        if (response.data.existParticipationData === false) setShowModal(true);
      } catch (err) {
        console.error('이벤트 상세 불러오기 실패:', err);
        setErrorMessage(
          '이벤트 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [idStr, initialEvent]);

  const handleTicketClick = useCallback(async () => {
    if (!eventData) return;

    const ticketMs = parseBackendLocalMs(eventData.eventTime);
    if (ticketMs === null) {
      alert(
        '이벤트 시작 시간을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.'
      );
      return;
    }

    const nowAdj = Date.now() + serverOffsetMs;
    const diff = ticketMs - nowAdj;
    const safetyMs = 300;

    if (diff > safetyMs) {
      alert('오픈까지 잠시 기다려주세요!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetchClient(`/ticketing/event/join/${idStr}`, {
        method: 'POST',
        headers: {
          'X-Client-Sent-At': new Date().toISOString(),
        },
      });
      if ((res as { code?: number }).code === 200) {
        router.push(`/ticketing/result?status=success&eventId=${idStr}`);
      }
    } catch (err) {
      console.error('티켓팅 실패', err);
      const msg = (err as { message?: string }).message;
      if (msg === 'API 요청 실패: 400') {
        router.push(`/ticketing/result?status=soldout&eventId=${idStr}`);
      } else {
        router.push(`/ticketing/result?status=error&eventId=${idStr}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventData, idStr, router, serverOffsetMs]);

  return (
    <Suspense>
      <Header showBack title="간식 나눔" />

      <DefaultBody hasHeader={1}>
        {isLoading && <LoadingOverlay />}

        {showModal && (
          <UserInfoModal
            onClose={() => setShowModal(false)}
            onComplete={() => {
              setIsInfo(true);
              setShowModal(false);
            }}
            initialStep={isInfo ? 2 : 1}
          />
        )}

        {errorMessage && (
          <div className="text-red-500 text-center my-4 text-sm">
            {errorMessage}
          </div>
        )}

        {!isLoading && !eventData && !errorMessage && (
          <div className="text-gray-500 text-center mt-4">
            이벤트 정보를 불러오는 중입니다.
          </div>
        )}

        {!isLoading && eventData && (
          <EventDetailContent
            eventData={eventData}
            isInfo={isInfo}
            selectedTab={isSelected}
            onTabChange={setIsSelected}
            onShowUserInfoModal={() => setShowModal(true)}
          />
        )}

        {eventData && (
          <TicketBottomBar
            eventData={eventData}
            ticketStatus={ticketStatus}
            upcomingLabel={upcomingLabel}
            remainingTime={remainingTime}
            onTicketClick={handleTicketClick}
          />
        )}
      </DefaultBody>
    </Suspense>
  );
}
