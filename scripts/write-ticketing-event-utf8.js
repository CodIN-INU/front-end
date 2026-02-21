/**
 * TicketingEventPage.tsx를 UTF-8 한글로 덮어씁니다.
 * 스크립트는 ASCII + \uXXXX만 사용해 인코딩 문제를 피합니다.
 */
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'src', 'features', 'ticketing', 'pages', 'TicketingEventPage.tsx');

// 한글을 유니코드 이스케이프로 (가독성을 위해 짧은 변수명 사용)
const _ = (s) => s; // identity for ASCII
const k = (s) => s.split('').map(c => c.charCodeAt(0) > 127 ? '\\u' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0') : c).join('');

// 수동으로 유니코드 이스케이프 (스크립트 파일이 ASCII만 갖도록)
const 알림구현되면사용 = '\uC54C\uB9BC \uAD6C\uD604\uB418\uBA74 \uC0AC\uC6A9';
const 서버시간보정 = '\uC11C\uBC84 \uC2DC\uAC04 \uBCF4\uC815';
const eventId문자열로정규화 = 'eventId \uBB38\uC790\uC5F4\uB85C \uC815\uADDC\uD654';
const 서버타임스탬프파싱헬퍼 = '\uC11C\uBC84 \uD0C0\uC784\uC2A4\uD0D1\uD504(\uB098\uB204\uCD08 \uD3EC\uD568 \uAC00\uB2A5) \uD30C\uC2F1 \uD5E4\uD130';
const 기본파싱시도 = '\uAE30\uBCF8 \uD30C\uC2F1 \uC2DC\uB3C4';
const 같은형식처리 = '\uAC19\uC740 \uD615\uC2DD \uCC98\uB9AC: ms \uC774\uD558 \uC790\uB77C\uC124 \uC6B0\uD2B8\uC2A4 \uAC00\uC9C0';
const 최대ms까지 = '\uCD5C\uB300 ms\uAE4C\uC9C0';
const 같은문자열을로컬시간으로 = '"2025.10.15 (Wed) 12:00" \uAC19\uC740 \uBB38\uC790\uC5F4\uC744 \uB85C\uCF00\uC5BC\uC2DC\uAC04\uC73C\uB85C \uD30C\uC2F1';
const 괄호안요일제거 = '\uACF5\uD638 \uC548 \uC694\uC77C \uC81C\uAC70';
const 기본형식 = '\uAE30\uBCF8 \uD615\uC2DD: YYYY.MM.DD HH:mm \uB610\uB294 YYYY-MM-DD HH:mm';
const 로컬KST기준Date생성 = '\uB85C\uCF00\uC5BC(KST) \uAE30\uC900 Date \uC0DD\uC131';
const 그외형식이면Dateparse시도 = '\uADF8 \uC678 \uD615\uC2DD\uC774\uBA74 Date.parse \uC2DC\uB3C4';
const SSE구독 = 'SSE \uAD6C\uB355: \uD2F0\uCF13 \uC2E4\uC2DC\uAC04 \uB370\uC774\uD130 + \uC11C\uBC84 \uC2DC\uAC04 \uBCF4\uC815';
const 기존연결정리 = '\uAE30\uC874 \uC5F0\uACB0 \uC815\uB9AC';
const 서버시간보정가능할때만 = '\uC11C\uBC84 \uC2DC\uAC04 \uBCF4\uC815 (\uAC00\uB2A5\uD560 \uB54C\uB9C8\uB2E4)';
const 수량데이터 = '\uC218\uB7C9 \uB370\uC774\uD130';
const quantity없음형식불일치 = 'quantity \uC5C6\uC74C/\uD615\uC2DD \uBD80\uC77C\uCE58';
const 주기적으로오는ping = '\uC8FC\uAE30\uC801\uC73C\uB85C \uC624\uB294 ping';
const 기타기본메시지는디버깅용 = '\uAE30\uD0C0 \uAE30\uBCF8 \uBA54\uC2DC\uC9C0\uB294 \uB514\uBC84\uAE09\uC6A9 \uB85C\uAE45';
const 자동재연결은서버브라우저 = '\uC790\uB3D9 \uC7AC\uC5F0\uACB0\uC740 \uC11C\uBC84/\uBE0C\uB77C\uC6B0\uC800 \uAE30\uBCF8 \uB3D9\uC791\uC5D0 \uBA39\uAE30';
const 상세조회 = '\uC0C1\uC138 \uC870\uD68C';
const 이벤트상세불러오기실패 = '\uC774\uBCA4\uD2B8 \uC0C1\uC138 \uBD80\uB7EC\uC624\uAE30 \uC2E4\uD328';
const 이벤트정보를불러오는데실패 = '\uC774\uBCA4\uD2B8 \uC815\uBCF4\uB97C \uBD80\uB7EC\uC624\uB294 \uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.';
const 서버시간보정기반상태데이터 = '\uC11C\uBC84 \uC2DC\uAC04 \uBCF4\uC815 \uAE30\uBC18 \uC0C1\uD0DC \uB370\uC774\uD130 (ms \uB2E8\uC704)';
const eventTime파싱실패 = 'eventTime \uD30C\uC2F1 \uC2E4\uD328';
const 로컬타임존기준자정으로정규화 = '\uB85C\uCF00\uC5BC \uD0C0\uC784\uC874 \uAE30\uC900 \uC790\uC815\uC73C\uB85C \uC815\uADDC\uD654 (KR\uC740 DST \uC5C6\uC74C)';
const 오픈일전 = (d) => `\uC624\uD504 ${d}\uC77C \uC804`;
const 삼시간미만이면 = '3\uC2DC\uAC04 \uBBF8\uB9CC\uC774\uBA74 "\uC624\uD504 n\uC2DC\uAC04 n\uBD84 \uC804"';
const 오픈시간분전 = (h, m) => `\uC624\uD504 ${h}\uC2DC\uAC04 ${m}\uBD84 \uC804`;
const 삼분이하면카운트다운 = '3\uBD84 \uC774\uD558\uBA74 \uCE74\uC6B0\uD2B8\uB2E4\uC6B4';
const 클릭시안전버퍼 = '\uD074\uB9AD \uC2DC \uC548\uC804 \uBC84\uD37C + \uD0C0\uC784\uC2A4\uD0D1\uD504 \uB85C\uAE45 + \uD5E4\uB354 \uC804\uB2E4';
const 이벤트시작시간을확인할수없습니다 = '\uC774\uBCA4\uD2B8 \uC2DC\uAC01 \uC2DC\uAC04\uC744 \uD655\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.';
const 경계보호용버퍼 = '\uAD50\uACAC \uBCF4\uD638\uC6A9 \uBC84\uD37C';
const 오픈까지잠시기다려주세요 = '\uC624\uD504\uAE4C\uC9C0 \uC7A0\uC2DC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694!';
const 클릭요청보냄 = '\uD074\uB9AD -> \uC694\uCCAD \uBCF4\uB0C0:';
const 서버로그용전달 = '\uC11C\uBC84 \uB85C\uAE45\uC6A9 \uC804\uB2E4';
const 응답수신 = '\uC751\uB2F5 \uC218\uC2E0:';
const 티켓팅실패 = '\uD2F0\uCF13\uD305 \uC2E4\uD328';
const API요청실패400 = 'API \uC694\uCCAD \uC2E4\uD328: 400';
const 간식나눔 = '\uAC04\uC2DD \uB098\uB218';
const 이벤트정보를불러오는중입니다 = '\uC774\uBCA4\uD2B8 \uC815\uBCF4\uB97C \uBD80\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.';
const 간식이미지 = '\uAC04\uC2DD \uC774\uBBF8\uC9C0';
const 잔여수량 = '\uC7A0\uC5EC \uC218\uB7C9';
const 개 = '\uAC1C';
const 실시간으로업데이트됩니다 = '\uC2E4\uC2DC\uAC04\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8 \uB429\uB2C8\uB2E4.';
const 수령할정보가이미입력되어있습니다 = '\uC218\uB829\uD560 \uC815\uBCF4\uAC00 \uC774\uBBF8 \uC785\uB825\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.';
const 빠른티켓팅을위해수령할 = '\uB0A8\uC740 \uD2F0\uCF13\uD305\uC744 \uC704\uD574 \uC218\uB829\uD560';
const 정보를먼저입력해주세요 = '\uC815\uBCF4\uB97C \uBBF8\uC6B0\uC800 \uC785\uB825\uD574\uC8FC\uC138\uC694.';
const 수령할정보수정 = '\uC218\uB829\uD560 \uC815\uBCF4 \uC218\uC815';
const 수령할정보입력 = '\uC218\uB829\uD560 \uC815\uBCF4 \uC785\uB825';
const 상세정보 = '\uC0C1\uC138\uC815\uBCF4';
const 유의사항 = '\uC720\uC758\uC0AC\uD56D';
const 일시 = '\uC77C\uC2DC';
const 장소 = '\uC7A5\uC18C';
const 대상 = '\uB300\uC0C1';
const 수량 = '\uC218\uB7C9';
const 티켓팅시작시간 = '\uD2F0\uCF13\uD305 \uC2DC\uAC01 \uC2DC\uAC04:';
const 학생회간식나눔정보글링크 = '\uD559\uC0DD\uD68C \uAC04\uC2DD\uB098\uB218 \uC815\uBCF4\uAE00 \uB9C1\uD06C';
const 문의 = '\uBB38\uC758';
const 구매내용 = '\uAD6C\uB9E4 \uB0B4\uC6A9';
const onePersonOne = '1\uC778 1\uB9E4';
const 구매가능합니다 = '\uAD6C\uB9E4 \uAC00\uB2A5\uD569\uB2C8\uB2E4.';
const 반드시 = '\uBC18\uB4DC\uC2DC';
const 본인학생증학번 = '\uBCF8\uC778 \uD559\uC0DD\uC99D\uB85C\uD559\uBC88';
const 구매해야하며 = '\uAD6C\uB9E4\uD574\uC57C \uD558\uBA70,';
const 수령시학생증으로본인확인 = '\uC218\uB829 \uC2DC \uD559\uC0DD\uC99D\uC73C\uB85C \uBCF8\uC778 \uD655\uC778\uD569\uB2C8\uB2E4.';
const 학생증미지참시수령불가 = '(\uD559\uC0DD\uC99D \uBBF8\uC9C0\uCC3E \uC2DC \uC218\uB829 \uBD88\uAC00)';
const 티켓의정해진수량으로 = '\uD2F0\uCF13\uC758 \uC815\uD574\uC9C4 \uC218\uB7C9\uC73C\uB85C,';
const 소진시조기마감됩니다 = '\uC18C\uC9C4 \uC2DC \uC870\uAE30 \uB9C8\uAC10\uB429\uB2C8\uB2E4.';
const 수령내용 = '\uC218\uB829 \uB0B4\uC6A9';
const 티켓팅성공시발급된 = '\uD2F0\uCF13\uD305 \uC131\uACF5 \uC2DC \uBC1C\uAE09\uB41C';
const 간식나눔교환권과학생증 = '\uAC04\uC2DD\uB098\uB218 \uAD50\uD658\uAD8C\uACFC \uD559\uC0DD\uC99D';
const 지참해야수령가능 = '\uC9C0\uCC3E\uD574\uC57C \uC218\uB829 \uAC00\uB2A5\uD569\uB2C8\uB2E4.';
const 간식나눔시작후30분 = '\uAC04\uC2DD\uB098\uB218 \uC2DC\uAC01 \uD6C4 30\uBD84';
const 미수령시당일티켓은자동취소 = '\uBBF8\uC218\uB829 \uC2DC \uB2F9\uC77C \uD2F0\uCF13\uC740 \uC790\uB3D9 \uCDE8\uC18C\uB418\uACE0';
const 당장배포됩니다 = '\uB2F9\uC7A5 \uBC30\uD3EC\uB429\uB2C8\uB2E4.';
const 도용거래금지 = '\uB3C4\uC6A9\uB7D0\uAC70\uB798 \uAE08\uC9C0';
const 도용매매거래가금지 = '\uB3C4\uC6A9, \uB9E4\uB9E4, \uAC70\uB798\uAC00 \uAE08\uC9C0';
const 타인명의매매및구매는 = '\uD0C0\uC778 \uBA85\uC758 \uB9E4\uB9E4 \uBC0F \uAD6C\uB9E4\uB294';
const 모두수령불가처리됩니다 = '\uBAA8\uB450 \uC218\uB829 \uBD88\uAC00 \uCC98\uB9AC\uB429\uB2C8\uB2E4.';
const 취소내용 = '\uCDE8\uC18C \uB0B4\uC6A9';
const 마감시간까지자유롭게취소가능 = '\uB9C8\uAC10\uC2DC\uAC04\uAE4C\uC9C0 \uC790\uC720\uB85D\uAC8C \uCDE8\uC18C \uAC00\uB2A5\uD569\uB2C8\uB2E4.';
const 취소는 = '\uCDE8\uC18C\uB294';
const 마이페이지간식나눔내티켓팅내역 = '[\uB9C8\uC774\uD398\uC774\uC9C0 \u2192 \uAC04\uC2DD\uB098\uB218 \u2192 \uB0B4 \uD2F0\uCF13\uD305 \uB0B4\uC5ED]';
const 에서진행됩니다 = '\uC5D0\uC11C \uC9C4\uD589\uB429\uB2C8\uB2E4.';
const 기재된시간에미수령시자동취소 = '\uAE30\uC800\uB41C \uC2DC\uAC04\uC5D0 \uBBF8\uC218\uB829 \uC2DC \uC790\uB3D9\uC73C\uB85C \uCDE8\uC18C\uB429\uB2C8\uB2E4.';
const 서비스이용문의 = '\uC11C\uBE44\uC2A4 \uC774\uC6A9 \uBB38\uC758:';
const CodIN인스타그램 = 'CodIN \uC778\uC2A4\uD0C0\uADF8\uE784';
const 간식나눔관련문의 = '\uAC04\uC2DD\uB098\uB218 \uAD00\uB828 \uBB38\uC758:';
const 주최측학생회 = '\uC8FC\uCD5C\uCE21 \uD559\uC0DD\uD68C';
const 문의시문의내용에고객님의 = '\uBB38\uC758 \uC2DC \uBB38\uC758 \uB0B4\uC6A9\uC5D0 \uACE0\uAC1D\uB2D8\uC758';
const 학과와학번성함을적어주시면 = '\uD559\uACFC\uC640 \uD559\uBC88, \uC131\uD568\uC744 \uC801\uC5B4\uC8FC\uC2DC\uBA74';
const 빠른처리가가능합니다 = '\uB0A8\uC740 \uCC98\uB9AC\uAC00 \uAC00\uB2A5\uD569\uB2C8\uB2E4.';
const 하단버튼 = '\uD558\uB2E8 \uBC84\uD2BC';
const 티켓팅하기 = '\uD2F0\uCF13\uD305\uD558\uAE30';
const 티켓팅마감 = '\uD2F0\uCF13\uD305 \uB9C8\uAC10';
const 티켓확인하기 = '\uD2F0\uCF13 \uD655\uC778\uD558\uAE30';
const 티켓은 = '\uD2F0\uCF13\uC740';

const content = `'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/features/ticketing/components/UserInfoModal';
import { fetchClient } from '@/api/clients/fetchClient';
import { FetchSnackDetailResponse, TicketEvent } from '@/types/snackEvent';
import { formatDateTimeWithDay } from '@/lib/utils/date';
import { convertToKoreanDate } from '@/lib/utils/convertToKoreanDate';


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

  // ${알림구현되면사용}
  const [upcomingLabel, setUpcomingLabel] = useState('');

  // SSE refs
  const sseRef = useRef<EventSource | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ${서버시간보정}(ms): serverNow - clientNow
  const serverOffsetRef = useRef(0);

  // ${eventId문자열로정규화}
  const idStr = Array.isArray(eventId) ? eventId[0] : String(eventId ?? '');

  // ${서버타임스탬프파싱헬퍼}
  const parseServerTimestamp = (ts: string): number | null => {
    if (!ts) return null;
    // ${기본파싱시도}
    const firstTry = Date.parse(ts);
    if (!Number.isNaN(firstTry)) return firstTry;

    // "2025-08-10T22:20:23.321417345" ${같은형식처리}
    try {
      const [iso, frac] = ts.split('.');
      const ms = (frac ?? '').slice(0, 3).padEnd(3, '0'); // ${최대ms까지}
      const fixed = \`\${iso}.\${ms}Z\`;
      const parsed = Date.parse(fixed);
      return Number.isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  };

  // ${같은문자열을로컬시간으로} -> ms
const parseBackendLocalMs = (raw: string): number | null => {
  if (!raw) return null;

  // ${괄호안요일제거}
  const cleaned = raw.replace(/\\s*\\([^)]+\\)\\s*/g, ' ').trim();

  // ${기본형식}
  const m = cleaned.match(
    /^(\\d{4})[.\\-](\\d{2})[.\\-](\\d{2})\\s+(\\d{2}):(\\d{2})$/
  );

  if (m) {
    const [, y, mo, d, hh, mm] = m.map(Number);
    // ${로컬KST기준Date생성}
    const dt = new Date(y, mo - 1, d, hh, mm, 0, 0);
    return dt.getTime();
  }

  // ${그외형식이면Dateparse시도}
  const fallback = Date.parse(cleaned);
  return Number.isNaN(fallback) ? null : fallback;
};


  // --- ${SSE구독} ---------------------------------
  useEffect(() => {
    if (!idStr) return;

    const url = \\\`\${process.env.NEXT_PUBLIC_API_URL}/ticketing/sse/subscribe/\${idStr}\\\`;
    console.log('[SSE] connect try:', url);

    // ${기존연결정리}
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

      // ${서버시간보정가능할때만}
      if (payload?.timestamp) {
        const serverMs = parseServerTimestamp(payload.timestamp);
        if (serverMs !== null) {
          const clientMs = Date.now();
          serverOffsetRef.current = serverMs - clientMs;
          console.log('[TIME] offset(ms)=', serverOffsetRef.current, ' server=', new Date(serverMs).toISOString());
        }
      }

      // ${수량데이터}
      if (typeof payload?.quantity === 'number') {
        setEventData(prev => (prev ? { ...prev, currentQuantity: payload.quantity } : prev));
      } else {
        console.warn('[SSE] ticketing-stock-sse: ${quantity없음형식불일치}', payload);
      }
    };

    const onHeartbeat = (evt: MessageEvent<any>) => {
      // ${주기적으로오는ping}
    };

    // ${기타기본메시지는디버깅용}
    es.onmessage = (evt) => {
      console.log('[SSE] DEFAULT message:', evt.data);
    };

    es.addEventListener('ticketing-stock-sse', onStock as EventListener);
    es.addEventListener('heartbeat', onHeartbeat as EventListener);

    es.onerror = (err) => {
      console.error('[SSE] ERROR (readyState=', es.readyState, '):', err);
      // ${자동재연결은서버브라우저}.
    };

    return () => {
      console.log('[SSE] CLEANUP: close');
      es.removeEventListener('ticketing-stock-sse', onStock as EventListener);
      es.removeEventListener('heartbeat', onHeartbeat as EventListener);
      es.close();
    };
  }, [idStr]);
  // -------------------------------------------------------------------------------------

  // ${상세조회}
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClient<FetchSnackDetailResponse>(\\\`/ticketing/event/\${idStr}\\\`);
        setEventData(response.data);
        setIsInfo(response.data.existParticipationData);
        if (response.data.existParticipationData === false) setShowModal(true);
        console.log('[DETAIL] loaded:', response);
      } catch (err) {
        console.error('${이벤트상세불러오기실패}:', err);
        setErrorMessage('${이벤트정보를불러오는데실패}');
      } finally {
        setIsLoading(false);
      }
    };
    if (idStr) fetchDetail();
  }, [idStr]);

  // ${서버시간보정기반상태데이터} --------------------------------------
    useEffect(() => {
        if (!eventData) return;

        const updateTicketStatus = () => {
            const ticketMs = parseBackendLocalMs(eventData.eventTime);
            if (ticketMs === null) {
              console.warn('[TIME] ${eventTime파싱실패}:', eventData.eventTime);
              setTicketStatus('closed');
              return;
            }

            const nowMs = Date.now() + serverOffsetRef.current; // ${서버시간보정}
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
              // ${로컬타임존기준자정으로정규화}
              from.setHours(0, 0, 0, 0);
              to.setHours(0, 0, 0, 0);
              const d = Math.ceil((to.getTime() - from.getTime()) / DAY);
              return Math.max(d, 0);
            };

            if (diffMs >= DAY) {
              setTicketStatus('upcoming');
              const days = calendarDaysLeft(nowMs, ticketMs);
              setUpcomingLabel(\`\uC624\uD504 \${days}\uC77C \uC804\`);
              return;
            }


            // ${삼시간미만이면}
            if (diffMs > 180_000) {
            setTicketStatus('upcoming');
            const hours = Math.floor(diffMs / 3_600_000);
            const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
            setUpcomingLabel(\`\uC624\uD504 \${hours}\uC2DC\uAC04 \${minutes}\uBD84 \uC804\`);
            return;
            }

            // ${삼분이하면카운트다운}
            setTicketStatus('countdown');
            const sec = Math.ceil(diffMs / 1000);
            const mm = String(Math.floor(sec / 60)).padStart(2, '0');
            const ss = String(sec % 60).padStart(2, '0');
            setRemainingTime(\\\`\${mm}:\${ss}\\\`);
            setUpcomingLabel('');
        };

        updateTicketStatus();
        const interval = setInterval(updateTicketStatus, 250);
        return () => clearInterval(interval);
        }, [eventData]);


  // ${클릭시안전버퍼}
  const handleTicketClick = async () => {
    if (!eventData) return;

      const ticketMs = parseBackendLocalMs(eventData.eventTime);
      if (ticketMs === null) {
        alert('${이벤트시작시간을확인할수없습니다}');
        return;
      }

      const nowAdj = Date.now() + serverOffsetRef.current;
      const diff = ticketMs - nowAdj;

      const safetyMs = 300; // ${경계보호용버퍼}

    if (diff > safetyMs) {
      console.log(\\\`[TICKET] too early by \${diff}ms (safety \${safetyMs})\\\`);
      alert('${오픈까지잠시기다려주세요}');
      return;
    }

    const clientSentAt = new Date();
    const clientSentAtISO = clientSentAt.toISOString();
    console.log('[TICKET] ${클릭요청보냄}', clientSentAt.toLocaleString(), clientSentAtISO);

    setIsLoading(true);
    try {
      const res = await fetchClient(\\\`/ticketing/event/join/\${idStr}\\\`, {
        method: 'POST',
        headers: {
          'X-Client-Sent-At': clientSentAtISO, // ${서버로그용전달}
        },
      });

      const clientReceivedAt = new Date();
      console.log('[TICKET] ${응답수신}', clientReceivedAt.toLocaleString(), clientReceivedAt.toISOString());
      if ((res as any).code === 200) {
        router.push(\\\`/ticketing/result?status=success&eventId=\${idStr}\\\`);
      }
    } catch (err) {
      console.error('${티켓팅실패}', err);
      if (err.message === '${API요청실패400}') {
        router.push(\\\`/ticketing/result?status=soldout&eventId=\${idStr}\\\`);
      } else if (err.code !== 400){
        router.push(\\\`/ticketing/result?status=error&eventId=\${idStr}\\\`);
        console.log(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense>
      <Header showBack title="${간식나눔}"/>

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
          <div className="text-gray-500 text-center mt-4">${이벤트정보를불러오는중입니다}</div>
        )}

        {!isLoading && eventData && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4 flex justify-center">
              <img src={eventData.eventImageUrls || "/images/default.svg"} alt="${간식이미지}"/>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex flex-row items-start font-semibold text-[18px]">
                  ${잔여수량}<span className="text-[#0D99FF] ml-1 mt-[-10px]">${개}</span>
                </div>
                <div className="text-[#0D99FF] font-semibold text-[18px]">
                  {eventData.currentQuantity}${개}
                </div>
              </div>
              <div className="text-[12px] text-black mt-1">${실시간으로업데이트됩니다}</div>
            </div>

            <div className="w-full border-t border-[#D4D4D4]" />

            <div className="flex flex-col items-center">
              <div className="text-sm text-black mt-2 text-center font-medium leading-[17px]">
                {isInfo ? '${수령할정보가이미입력되어있습니다}' : <>${빠른티켓팅을위해수령할}<br /> ${정보를먼저입력해주세요}</>}
              </div>
              <button
                className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]"
                onClick={() => setShowModal(true)}
              >
                {isInfo ? '${수령할정보수정}' : '${수령할정보입력}'}
              </button>
            </div>

            <div className="w-full flex justify-end text-[11px] text-[#0D99FF] gap-3">
              <button
                className={\\\`\${isSelected === 'note' && 'text-[#AEAEAE]'} underline underline-offset-[3px]\\\`}
                onClick={() => setIsSelected('info')}
              >
                ${상세정보}
              </button>
              <button
                className={\\\`\${isSelected === 'info' && 'text-[#AEAEAE]'} underline underline-offset-[3px]\\\`}
                onClick={() => setIsSelected('note')}
              >
                ${유의사항}
              </button>
            </div>

            <div className="flex flex-col w-full mb-[50px] bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px] text-black gap-y-1">
              {isSelected === 'info' && (
                <>
                  <div className="font-bold text-[14px] mb-2">{eventData.eventTitle}</div>
                  <div><span className="font-semibold">${일시}:</span> {convertToKoreanDate(eventData.eventEndTime)}</div>
                  <div><span className="font-semibold">${장소}: </span> {eventData.locationInfo}</div>
                  <div><span className="font-semibold">${대상}:</span>  {eventData.target}</div>
                  <div><span className="font-semibold">${수량}:</span>  {eventData.quantity}</div>
                  <div><span className="font-semibold">${티켓팅시작시간}</span>  {convertToKoreanDate(eventData.eventTime)}</div>
                  <div className="text-black/50 self-center mt-[18px]">{eventData.description}</div>
                  <a href={eventData.promotionLink} className="text-[#0D99FF] mt-[18px] underline underline-offset-[3px]">${학생회간식나눔정보글링크}</a>
                  <div className="self-end text-[#AEAEAE]">${문의}: {eventData.inquiryNumber}</div>
                </>
              )}

              {isSelected === 'note' && (
                <>
                  <div className="font-bold text-[13px]">${구매내용}</div>
                  <div>
                    • <span className="text-[#0D99FF]">${onePersonOne}</span>씩 ${구매가능합니다} <br />
                    • ${반드시} <span className="text-[#0D99FF]">${본인학생증학번}</span>으로 ${구매해야하며} ${수령시학생증으로본인확인} <span className="text-[#eb2e2e]">${학생증미지참시수령불가} </span><br />
                    • ${티켓의정해진수량으로} ${소진시조기마감됩니다}
                  </div>
                  <div className="font-bold text-[13px] mt-1">${수령내용}</div>
                  <div>
                    • ${티켓팅성공시발급된} <span className="text-[#0D99FF]">${간식나눔교환권과학생증}</span>을 ${지참해야수령가능}  <br />
                    • <span className="text-[#0D99FF]">${간식나눔시작후30분}</span> ${미수령시당일티켓은자동취소} ${당장배포됩니다}
                  </div>
                  <div className="font-bold text-[13px] mt-1">${도용거래금지}</div>
                  <div>
                    • ${티켓은} <span className="text-[#0D99FF]">${도용매매거래가금지}</span>이며, ${타인명의매매및구매는} ${모두수령불가처리됩니다}
                  </div>
                  <div className="font-bold text-[13px] mt-1">${취소내용}</div>
                  <div>
                    • ${마감시간까지자유롭게취소가능}  <br />
                    • ${취소는} <span className="text-[#0D99FF]">${마이페이지간식나눔내티켓팅내역}</span>${에서진행됩니다} <br />
                    • ${기재된시간에미수령시자동취소}
                  </div>
                  <div className="font-bold text-[13px] mt-1">${문의}</div>
                  <div>
                    • ${서비스이용문의} <a href="https://www.instagram.com/codin_inu?igsh=bnZ0YmhjaWxtMXp4" className="underline text-[#0D99FF]">${CodIN인스타그램} </a> DM <br />
                    • ${간식나눔관련문의} ${주최측학생회}
                  </div>
                  <div className="text-[#AEAEAE] text-center mt-2">
                    ${문의시문의내용에고객님의} ${학과와학번성함을적어주시면}<br /> ${빠른처리가가능합니다}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ${하단버튼} */}
        {eventData && (
          <div className="fixed bottom-[50px] left-0 w-full px-4 bg-white pb-[35px] flex justify-center">
            {(ticketStatus === 'available') && (eventData.currentQuantity !== 0) && (
              <button
                className="w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
                onClick={handleTicketClick}
              >
                ${티켓팅하기}
              </button>
            )}

            {(ticketStatus === 'upcoming') && (
              <button className="w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-white rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
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
                ${티켓팅마감}
              </button>
            )}

            {(ticketStatus === 'completed') && (
              <button
                className="w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
                onClick={handleTicketClick}
              >
                ${티켓확인하기}
              </button>
            )}
          </div>
        )}
      </DefaultBody>
    </Suspense>
  );
}
`;

fs.writeFileSync(outPath, content, { encoding: 'utf8' });
console.log('Written:', outPath);
