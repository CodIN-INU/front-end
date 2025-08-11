// pages/ticketing/ticket/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import SignModal from '@/components/modals/ticketing/SignModal';
import { formatDateTimeWithDay } from '@/utils/date';
import CancelModal from '@/components/modals/ticketing/CancelModal';

export default function SnackDetail() {
  const router = useRouter();
  const { eventId } = useParams(); // ✅ URL 파라미터 받기
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  const dummyData = {
    num: '001',
    image: '/images/snack.svg',
    quantity: '500개',
    title: '총장님과 함께하는 중간고사 간식나눔',
    date: '2025-07-22T18:43:00',
    location: '인천대학교 송도캠퍼스 17호관 앞',
    organizer: '인천대 재학생',
    ticketTime: '17:00',
    href: 'https://www.instagram.com/',
    phone: '010-0000-0000',
  };

  return (
    <Suspense>
      <Header>
        <Header.BackButton onClick={() => router.back()} />
        <Header.Title>간식나눔 교환권</Header.Title>
      </Header>

      <DefaultBody hasHeader={1}>
        <div className="w-full flex justify-center items-center mt-[15%] px-[40px]">
          <img src="/icons/ticketing/ticket.svg" />
          <p className="absolute text-[40px] text-[#0D99FF] mt-[-30px] font-extrabold">no. {dummyData.num}</p>
        </div>

        <div>
          <p className="font-bold text-[14px] text-center text-[#0D99FF]">
            수령장소: {dummyData.location}
            <span className="text-[#0D99FF] ml-1 mt-[-10px] font-semibold text-[18px]">•</span>
          </p>
          <p className="font-bold text-[12px] text-center text-black">관리자에게 이 화면을 보여준 후 서명하세요</p>
          <p className="text-[12px] text-center text-black/50 font-normal mt-[13px]">
            교환권은 마이페이지에서도 확인 가능해요
          </p>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 bg-white pb-[35px] flex flex-col items-center">
          <div className="text-[11px] text-center text-[#FF2525] font-normal">
            {formatDateTimeWithDay(dummyData.date)}까지 오지 않으면 티켓이 자동 취소돼요.
            <br /> 그 전에 꼭 방문해 주세요!
          </div>

          <button
            className="mt-3 w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
            onClick={() => setShowSignModal(true)} // ✅ 모달 열기
          >
            서명 하기
          </button>

          <button
            className="mt-3 w-full h-[50px] bg-[#EBF0F7] text-[#808080] rounded-[5px] text-[18px] font-medium max-w-[500px]"
            onClick={()=>setShowCancelModal(true)}
          >
            티켓팅 취소하기
          </button>
        </div>

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
}
