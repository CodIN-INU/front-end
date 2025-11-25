// app/(auth-required)/ticketing/result/TicketingResultInner.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import SignModal from '@/components/modals/ticketing/SignModal';
import CancelModal from '@/components/modals/ticketing/CancelModal';
import { fetchClient } from '@/api/clients/fetchClient';
import { TicketInfo } from '@/interfaces/SnackEvent';

export default function TicketingResultInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get('status');
  const eventId = searchParams.get('eventId');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketInfo>();
  



  useEffect(() => {
    if (!status || !eventId) {
      router.replace('/');
      return;
    }
  }, [status, eventId, router]);

  useEffect(() => {
    if (!eventId) return; 
    let ignore = false;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetchClient(
          `/ticketing/event/participation/${eventId}`
        );
        if (!ignore) setTicket(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [eventId]);
  

  if (!status || !eventId) return null;
  if (isLoading && !ticket) return <div />;

  switch (status) {
    case 'success':
      return (
        <Suspense>
          <Header
            title="간식나눔 교환권"
            showBack
          />

          <DefaultBody hasHeader={1}>
            <div className="w-full flex justify-center items-center mt-[15%] px-[40px]">
              <img src="/icons/ticketing/ticket.svg" />
              <p className="absolute text-[40px] text-[#0D99FF] mt-[-30px] font-extrabold">
                no. {String(ticket?.ticketNumber ?? 0).padStart(3, '0')}
              </p>
            </div>

            {ticket?.status === 'WAITING' && (
              <>
                <div>
                  <p className="font-bold text-[14px] text-center text-[#0D99FF] flex justify-center">
                    수령장소: {ticket.locationInfo}
                    <span className="text-[#0D99FF] ml-1 mt-[-10px] font-semibold text-[18px]">
                      •
                    </span>
                  </p>
                  <p className="font-bold text-[12px] text-center text-black mt-2">
                     서명 후 학생회가 제공하는 비밀번호 4자리를 <br/>
                      직접 입력하고 화면을 보여주세요
                  </p>
                  <p className="text-[12px] text-center text-black/50 font-normal mt-[13px]">
                    교환권은 마이페이지에서도 확인 가능해요
                  </p>
                </div>

                <div className="fixed bottom-[50px] left-0 w-full px-4 bg-white pb-[35px] flex flex-col items-center">
                  
                  <div className="text-[12px] text-center text-[#0D99FF] font-normal flex flex-row">
                   
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="#0D99FF"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 8V12L14.5 14.5"
                        stroke="#0D99FF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                     <div>간식나눔 시작 30분 전까지 오지 않으면  티켓이 자동 취소돼요.</div>
                    
                   
                  </div>

                  <button
                    className="mt-3 w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
                    onClick={() => setShowSignModal(true)}
                  >
                    서명 하기
                  </button>

                  <button
                    className="mt-3 w-full h-[50px] bg-[#EBF0F7] text-[#808080] rounded-[5px] text-[18px] font-medium max-w-[500px]"
                    onClick={() => setShowCancelModal(true)}
                  >
                    티켓팅 취소하기
                  </button>
                </div>
              </>
            )}

            {ticket?.status === 'COMPLETED' && (
              <div className="flex flex-col">
                <p className="font-bold text-[14px] text-center text-[#0D99FF]">
                  CodIN
                  <span className="text-black">
                    과 함께 맛있는 시간 보내세요!
                  </span>
                  <span className="text-[#0D99FF] ml-1 mt-[-10px] font-semibold text-[18px]">
                    •
                  </span>
                </p>

                <div className="w-full h-[200px] bg-white shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] rounded-[15px] flex justify-center items-center px-4 mt-[72px]">
                  <img
                    src={ticket.signatureImgUrl}
                    className="w-full max-h-[200px]"
                  />
                </div>
                <p className="text-center text-[12px] text-black/50 mt-[19px] mb-4">
                  수령 확인 및 본인 확인 용도로 사용됩니다.
                </p>
              </div>
            )}

            {showSignModal && (
              <SignModal
                onClose={() => setShowSignModal(false)}
                eventId={String(eventId)}
              />
            )}
            {showCancelModal && (
              <CancelModal
                onClose={() => setShowCancelModal(false)}
                eventId={String(eventId)}
              />
            )}
          </DefaultBody>
        </Suspense>
      );

    case 'soldout':
      return (
        <Suspense>
          <div className="flex flex-col justify-center items-center w-full h-screen">
            <img src="/icons/ticketing/soldoutEmo.svg" />
            <div className="text-balck text-[16px] font-bold text-center mt-4 mb-[45px]">
              아쉽게도 티켓이 모두 매진되었어요.
            </div>
            <button className="w-[220px] h-[50px] bg-[#0D99FF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-full text-white" onClick={router.back}>
              취소표 확인하러 가기
            </button>
          </div>
        </Suspense>
      );

    case 'error':
      return (
        <Suspense>
          <div className="flex flex-col justify-center items-center w/full h-screen">
            <img src="/icons/ticketing/errEmo.svg" />
            <div className="text-balck text-[16px] font-bold text-center mt-4 mb-[45px]">
              일시적인 오류로 서비스 접속에 실패했습니다. <br /> 잠시 후 다시
              시도해주세요.
            </div>
            <button className="w-[220px] h-[50px] bg-[#0D99FF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-full text-white" onClick={router.back}>
              다시 시도하기
            </button>
          </div>
        </Suspense>
      );

    default:
      return (
        <Suspense>
          <div>알 수 없는 상태입니다.</div>
        </Suspense>
      );
  }
}
