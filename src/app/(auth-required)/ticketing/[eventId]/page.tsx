'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/components/modals/ticketing/UserInfoModal';
import { fetchClient } from '@/api/clients/fetchClient';
import { FetchSnackDetailResponse, TicketEvent } from '@/interfaces/SnackEvent';
import { formatDateTimeWithDay } from '@/utils/date';
import { convertToKoreanDate } from '@/utils/convertToKoreanDate';


export default function SnackDetail() {
  const router = useRouter();
  const { eventId } = useParams();

  const [isInfo, setIsInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState<TicketEvent | null>(null);
  const [ticketStatus, setTicketStatus] = useState<'available' | 'upcoming' | 'countdown' | 'closed' | 'completed'>('closed');
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSelected, setIsSelected] = useState<'info' | 'note'>('info');

  //알림 구현되면 삭제
  const [upcomingLabel, setUpcomingLabel] = useState('');

  // SSE refs
  const sseRef = useRef<EventSource | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 서버 시간 보정값(ms): serverNow - clientNow
  const serverOffsetRef = useRef(0);

  // eventId 문자열로 정규화
  const idStr = Array.isArray(eventId) ? eventId[0] : String(eventId ?? '');

  // 서버 타임스탬프(나노초 포함 가능) 파싱 헬퍼
  const parseServerTimestamp = (ts: string): number | null => {
    if (!ts) return null;
    // 일반 파싱 시도
    const firstTry = Date.parse(ts);
    if (!Number.isNaN(firstTry)) return firstTry;

    // "2025-08-10T22:20:23.321417345" 같은 형식 처리: ms 이하 잘라서 UTC 가정
    try {
      const [iso, frac] = ts.split('.');
      const ms = (frac ?? '').slice(0, 3).padEnd(3, '0'); // 최대 ms까지
      const fixed = `${iso}.${ms}Z`;
      const parsed = Date.parse(fixed);
      return Number.isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  };

  // "2025.10.15 (Wed) 12:00" 같은 문자열을 로컬시간으로 파싱 → ms
const parseBackendLocalMs = (raw: string): number | null => {
  if (!raw) return null;

  // 괄호 속 요일(영/한) 제거: (Mon|Tue|...|Sun|월|화|수|목|금|토|일)
  const cleaned = raw.replace(
    /\s*\((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|월|화|수|목|금|토|일)\)\s*/i,
    ' '
  ).trim();

  // 기대 포맷: YYYY.MM.DD HH:mm  또는  YYYY-MM-DD HH:mm
  const m = cleaned.match(
    /^(\d{4})[.\-](\d{2})[.\-](\d{2})\s+(\d{2}):(\d{2})$/
  );

  if (m) {
    const [, y, mo, d, hh, mm] = m.map(Number);
    // 로컬(KST) 기준 Date 생성
    const dt = new Date(y, mo - 1, d, hh, mm, 0, 0);
    return dt.getTime();
  }

  // 혹시 다른 변형이 와도 마지막으로 Date.parse 시도
  const fallback = Date.parse(cleaned);
  return Number.isNaN(fallback) ? null : fallback;
};


  // --- SSE 구독: 재고 실시간 업데이트 + 서버 시각 보정 ---------------------------------
  useEffect(() => {
    if (!idStr) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/ticketing/sse/subscribe/${idStr}`;
    console.log('[SSE] connect try:', url);

    // 기존 연결 정리
    if (sseRef.current) {
      console.log('[SSE] close previous');
      sseRef.current.close();
      sseRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    const es = new EventSource(url, { withCredentials: true });
    sseRef.current = es;

    es.onopen = () => {
      console.log('[SSE] OPEN (readyState=', es.readyState, ')');
    };

    const onStock = (evt: MessageEvent<any>) => {
      console.log('[SSE] ticketing-stock-sse DATA:', evt.data);
      let payload: any = evt.data;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch {}
      }

      // 서버 시각 보정 (가능할 때만)
      if (payload?.timestamp) {
        const serverMs = parseServerTimestamp(payload.timestamp);
        if (serverMs !== null) {
          const clientMs = Date.now();
          serverOffsetRef.current = serverMs - clientMs;
          console.log('[TIME] offset(ms)=', serverOffsetRef.current, ' server=', new Date(serverMs).toISOString());
        }
      }

      // 수량 업데이트
      if (typeof payload?.quantity === 'number') {
        setEventData(prev => (prev ? { ...prev, currentQuantity: payload.quantity } : prev));
      } else {
        console.warn('[SSE] ticketing-stock-sse: quantity 없음/형식 불일치:', payload);
      }
    };

    const onHeartbeat = (evt: MessageEvent<any>) => {
      // 주기적으로 오는 ping
      // console.log('[SSE] heartbeat:', evt.data);
    };

    // 혹시 기본 메시지도 올 수 있으니 로깅
    es.onmessage = (evt) => {
      console.log('[SSE] DEFAULT message:', evt.data);
    };

    es.addEventListener('ticketing-stock-sse', onStock as EventListener);
    es.addEventListener('heartbeat', onHeartbeat as EventListener);

    es.onerror = (err) => {
      console.error('[SSE] ERROR (readyState=', es.readyState, '):', err);
      // 자동 재연결이 서버/브라우저 기본 동작임. 명시적으로 닫지 않음.
    };

    return () => {
      console.log('[SSE] CLEANUP: close');
      es.removeEventListener('ticketing-stock-sse', onStock as EventListener);
      es.removeEventListener('heartbeat', onHeartbeat as EventListener);
      es.close();
    };
  }, [idStr]);
  // -------------------------------------------------------------------------------------

  // 상세 조회
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClient<FetchSnackDetailResponse>(`/ticketing/event/${idStr}`);
        setEventData(response.data);
        setIsInfo(response.data.existParticipationData);
        if (response.data.existParticipationData === false) setShowModal(true);
        console.log('[DETAIL] loaded:', response);
      } catch (err) {
        console.error('❌ 이벤트 상세 불러오기 실패:', err);
        setErrorMessage('이벤트 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };
    if (idStr) fetchDetail();
  }, [idStr]);

  // 서버 시각 보정 기반 상태 업데이트 (ms 단위) --------------------------------------
    useEffect(() => {
        if (!eventData) return;

        const updateTicketStatus = () => {
            const ticketMs = parseBackendLocalMs(eventData.eventTime);
            if (ticketMs === null) {
              console.warn('[TIME] eventTime 파싱 실패:', eventData.eventTime);
              setTicketStatus('closed');
              return;
            }

            const nowMs = Date.now() + serverOffsetRef.current; // 서버 시간 보정
            const diffMs = ticketMs - nowMs;

            if (eventData.eventStatus === 'ENDED') {
            setTicketStatus('closed');
            setUpcomingLabel('');
            return;
            }

            if (diffMs <= 0 && eventData.userParticipatedInEvent === false) {
            setTicketStatus('available');
            setRemainingTime('00:00');
            setUpcomingLabel('');
            return;
            }

            if (diffMs <= 0 && eventData.userParticipatedInEvent === true) {
            setTicketStatus('completed');
            setRemainingTime('00:00');
            setUpcomingLabel('');
            return;
            }

            const DAY = 86_400_000;

            const calendarDaysLeft = (fromMs: number, toMs: number) => {
              const from = new Date(fromMs);
              const to = new Date(toMs);
              // 로컬 타임존 기준 자정으로 정규화 (KR은 DST 없어 안정적)
              from.setHours(0, 0, 0, 0);
              to.setHours(0, 0, 0, 0);
              const d = Math.ceil((to.getTime() - from.getTime()) / DAY);
              return Math.max(d, 0);
            };

            if (diffMs >= DAY) {
              setTicketStatus('upcoming');
              const days = calendarDaysLeft(nowMs, ticketMs);
              setUpcomingLabel(`오픈 ${days}일 전`);
              return;
            }


            // 하루 미만 → "오픈 n시간 n분 전"
            if (diffMs > 180_000) {
            setTicketStatus('upcoming');
            const hours = Math.floor(diffMs / 3_600_000);
            const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
            setUpcomingLabel(`오픈 ${hours}시간 ${minutes}분 전`);
            return;
            }

            // 3분 이하 →  카운트다운
            setTicketStatus('countdown');
            const sec = Math.ceil(diffMs / 1000);
            const mm = String(Math.floor(sec / 60)).padStart(2, '0');
            const ss = String(sec % 60).padStart(2, '0');
            setRemainingTime(`${mm}:${ss}`);
            setUpcomingLabel('');
        };

        updateTicketStatus();
        const interval = setInterval(updateTicketStatus, 250);
        return () => clearInterval(interval);
        }, [eventData]);


  // 클릭 시 안전 버퍼 + 타임스탬프 로깅 + 헤더로 전달
  const handleTicketClick = async () => {
    if (!eventData) return;

      const ticketMs = parseBackendLocalMs(eventData.eventTime);
      if (ticketMs === null) {
        alert('이벤트 시작 시간을 해석할 수 없습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      const nowAdj = Date.now() + serverOffsetRef.current;
      const diff = ticketMs - nowAdj;

      const safetyMs = 300; // 경계 보호용 버퍼
      
    if (diff > safetyMs) {
      console.log(`[TICKET] too early by ${diff}ms (safety ${safetyMs})`);
      alert('오픈까지 잠시만 기다려주세요!');
      return;
    }

    const clientSentAt = new Date();
    const clientSentAtISO = clientSentAt.toISOString();
    console.log('[TICKET] 클릭 -> 요청 보냄:', clientSentAt.toLocaleString(), clientSentAtISO);

    setIsLoading(true);
    try {
      const res = await fetchClient(`/ticketing/event/join/${idStr}`, {
        method: 'POST',
        headers: {
          'X-Client-Sent-At': clientSentAtISO, // 서버 로그와 대조
        },
      });

      const clientReceivedAt = new Date();
      console.log('[TICKET] 응답 수신:', clientReceivedAt.toLocaleString(), clientReceivedAt.toISOString());
      if ((res as any).code === 200) {
        router.push(`/ticketing/result?status=success&eventId=${idStr}`);
      } 
    } catch (err) {
      console.error('티켓팅 실패', err);
      if (err.message === 'API 요청 실패: 400') {
        router.push(`/ticketing/result?status=soldout&eventId=${idStr}`);
      } else if (err.code !== 400){
        router.push(`/ticketing/result?status=error&eventId=${idStr}`);
        console.log(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense>
      <Header showBack title='간식나눔'/>

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
          <div className="text-gray-500 text-center mt-4">이벤트 정보를 불러올 수 없습니다.</div>
        )}

        {!isLoading && eventData && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4 flex justify-center">
              <img src={eventData.eventImageUrls || "/images/default.svg"} alt="간식 이미지"/>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex flex-row items-start font-semibold text-[18px]">
                  잔여 수량<span className="text-[#0D99FF] ml-1 mt-[-10px]">•</span>
                </div>
                <div className="text-[#0D99FF] font-semibold text-[18px]">
                  {eventData.currentQuantity}개
                </div>
              </div>
              <div className="text-[12px] text-black mt-1">실시간으로 업데이트 됩니다.</div>
            </div>

            <div className="w-full border-t border-[#D4D4D4]" />

            <div className="flex flex-col items-center">
              <div className="text-sm text-black mt-2 text-center font-medium leading-[17px]">
                {isInfo ? '수령자 정보를 이미 입력했어요.' : <>빠른 티켓팅을 위해 수령자 <br /> 정보를 먼저 입력해주세요.</>}
              </div>
              <button
                className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]"
                onClick={() => setShowModal(true)}
              >
                {isInfo ? '수령자 정보 수정' : '수령자 정보 입력'}
              </button>
            </div>

            <div className="w-full flex justify-end text-[11px] text-[#0D99FF] gap-3">
              <button
                className={`${isSelected === 'note' && 'text-[#AEAEAE]'} underline underline-offset-[3px]`}
                onClick={() => setIsSelected('info')}
              >
                상세정보
              </button>
              <button
                className={`${isSelected === 'info' && 'text-[#AEAEAE]'} underline underline-offset-[3px]`}
                onClick={() => setIsSelected('note')}
              >
                유의사항
              </button>
            </div>

            <div className="flex flex-col w-full mb-[50px] bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px] text-black gap-y-1">
              {isSelected === 'info' && (
                <>
                  <div className="font-bold text-[14px] mb-2">{eventData.eventTitle}</div>
                  <div><span className='font-semibold'>일시:</span> {convertToKoreanDate(eventData.eventEndTime)}</div>
                  <div><span className='font-semibold'>장소: </span> {eventData.locationInfo}</div>
                  <div><span className='font-semibold'>대상:</span>  {eventData.target}</div>
                  <div><span className='font-semibold'>수량:</span>  {eventData.quantity}</div>
                  <div><span className='font-semibold'>티켓팅 시작 시간:</span>  {convertToKoreanDate(eventData.eventTime)}</div>
                  <div className="text-black/50 self-center mt-[18px]">{eventData.description}</div>
                  <a href={eventData.promotionLink} className="text-[#0D99FF] mt-[18px] underline underline-offset-[3px]">학생회 간식나눔 홍보글 링크</a>
                  <div className="self-end text-[#AEAEAE]">문의: {eventData.inquiryNumber}</div>
                </>
              )}

              {isSelected === 'note' && (
                <>
                  <div className="font-bold text-[13px]">예매 안내</div>
                  <div>
                    • <span className="text-[#0D99FF]">1인 1매</span>만 예매 가능합니다. <br />
                    • 반드시 <span className="text-[#0D99FF]">본인의 학과·학번</span>으로 예매해야 하며, 수령 시 학생증으로 본인 여부를 확인합니다. <span className="text-[#eb2e2e]">(학생증 미지참 시 수령 불가) </span><br />
                    • 티켓은 한정 수량으로, 소진 시 조기 마감될 수 있습니다.
                  </div>
                  <div className="font-bold text-[13px] mt-1">수령 안내</div>
                  <div>
                    • 티켓팅 성공 시 발급된 <span className="text-[#0D99FF]">간식나눔 교환권과 학생증</span>을 제시해야 수령 가능합니다.  <br />
                    • <span className="text-[#0D99FF]">간식나눔 시작 후 30분 내</span> 미수령 시, 해당 티켓은 자동 취소되고 현장 배부로 전환됩니다.
                  </div>
                  <div className="font-bold text-[13px] mt-1">양도·거래 금지</div>
                  <div>
                    • 티켓의 <span className="text-[#0D99FF]">양도, 판매, 거래를 금지</span>하며, 적발 시 판매자와 구매자 모두 수령 불가 처리됩니다.
                  </div>
                  <div className="font-bold text-[13px] mt-1">취소 안내</div>
                  <div>
                    • 티켓팅 마감시간까지 자유롭게 취소할 수 있습니다.  <br />
                    • 취소는 <span className="text-[#0D99FF]">[마이페이지 → 간식나눔 → 티켓팅 내역]</span>에서 진행할 수 있습니다. <br />
                    • 기재된 시간 내 미수령 시, 자동으로 취소됩니다.
                  </div>
                  <div className="font-bold text-[13px] mt-1">문의</div>
                  <div>
                    • 서비스 이용 문의: <a href="https://www.instagram.com/codin_inu?igsh=bnZ0YmhjaWxtMXp4" className="underline text-[#0D99FF]">CodIN 인스타그램 </a> DM <br />
                    • 간식나눔 관련 문의: 주관처(학생회)
                  </div>
                  <div className="text-[#AEAEAE] text-center mt-2">
                    온라인 문의 시 고객님의 학과와 학번, 성함을 남겨주시면 <br /> 더 빠른 처리가 가능합니다.
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        {eventData && (
          <div className="fixed bottom-[50px] left-0 w-full px-4 bg-white pb-[35px] flex justify-center">
            {(ticketStatus === 'available') && (eventData.currentQuantity !== 0) && (
              <button
                className="w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
                onClick={handleTicketClick}
              >
                티켓팅하기
              </button>
            )}

            {(ticketStatus === 'upcoming') && (
              <button className="w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-white rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
                {/* <img src="/icons/alert.svg" alt="alert" /> 오픈 전 알림 받기 */}
                {upcomingLabel} 
              </button>
            )}

            {(ticketStatus === 'countdown')&& (
              <button className="w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-[#EBF0F7] rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
                <img src="/icons/timer.svg" alt="timer" /> <span>{remainingTime}</span>
              </button>
            )}

            {(eventData.currentQuantity === 0) && ((ticketStatus !== 'completed')) && (
              <button className="w-full h-[50px] bg-[#A6A6AB] text-[#808080] rounded-[5px] text-[18px] font-bold max-w-[500px]" disabled>
                티켓팅 마감
              </button>
            )}
            
            {(ticketStatus === 'completed') && (
              <button
                className="w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
                onClick={handleTicketClick}
              >
                티켓 확인하기
              </button>
            )}
          </div>
        )}
      </DefaultBody>
    </Suspense>
  );
}
