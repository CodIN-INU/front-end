'use client';
import { FC, ReactNode, useEffect, useState } from 'react';
import AlarmModal from '@/components/modals/AlarmModal';
import { useAuth } from '@/store/userStore';
import { MainCalendarSection, MainSectionSkeleton } from '../components';

interface MainPageProps {
  /** 서버에서 렌더된 RoomStatus + Ranking 섹션 (SSR로 초기 HTML 포함 → LCP 개선) */
  belowFoldContent?: ReactNode;
}

const MainPage: FC<MainPageProps> = ({ belowFoldContent }) => {
  const fetchMe = useAuth(s => s.fetchMe);
  const hasHydrated = useAuth(s => s.hasHydrated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deferBelowFold, setDeferBelowFold] = useState(!!belowFoldContent); // SSR 콘텐츠 있으면 즉시 표시

  useEffect(() => {
    if (hasHydrated) fetchMe();
  }, [hasHydrated, fetchMe]);


  // const [hasNewAlarm, setHasNewAlarm] = useState(false); // 알람 여부

  // const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  // const mapPostCategoryToLabel = (postCategory: string) => {
  //   for (const boardKey in boardData) {
  //     const board = boardData[boardKey];
  //     const tab = board.tabs.find((tab) => tab.postCategory === postCategory);
  //     if (tab) return board.name;
  //   }
  //   return "알 수 없음";
  // };

  // 첫 페인트 후 아래쪽 섹션(강의실/랭킹) 로드 → 초기 번들·실행 비용 감소
  useEffect(() => {
    const useIdle = typeof window.requestIdleCallback === 'function';
    const id = useIdle
      ? window.requestIdleCallback(() => setDeferBelowFold(true), { timeout: 200 })
      : window.setTimeout(() => setDeferBelowFold(true), 0);
    return () => {
      if (useIdle) window.cancelIdleCallback(id as number);
      else clearTimeout(id);
    };
  }, []);

  // 메인 페이지가 로딩되었을 때(세션 내 최초) 웹뷰로 "LOGIN_SUCCESS" 메시지 전송
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMessageSent = sessionStorage.getItem('loginMessageSent');
      if (
        !isMessageSent &&
        window.ReactNativeWebView &&
        window.ReactNativeWebView.postMessage
      ) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'LOGIN_SUCCESS' })
        );
        sessionStorage.setItem('loginMessageSent', 'true');
      }
    }
  }, []);

  return (
    <>
      {/* 헤더 */}
      {process.env.NEXT_PUBLIC_ENV === 'dev' && (
        <div className="text-center mt-5 pd-5 font-bold  mb-4">
          🚧 이곳은 개발 서버입니다.
        </div>
      )}

      {/* <ShadowBox className="pl-[19px] pr-[14px] pt-[28px] pb-[25px] h-[213px]">
        <div>
          <div className="ml-[4px] mb-[10px]">
            <h1 className="text-[22px] font-bold">
              학생회에게
              <br />
              하고 싶은 말이 있을 땐?
            </h1>
            <span className="text-[12px] font-mediu text-sub leading-[30px]">
              내 아이디어로 학교를 바꾸자!
            </span>
          </div>
          <Link
            href={'/main/dept/#ananymous-voice-box'}
            className="px-[14px] py-[7px] text-[11px] bg-main text-white rounded-[20px]"
          >
            익명의 소리함 바로가기
          </Link>
        </div>
        <div className="absolute bottom-[25px] right-[14px]">
          <WorkingTogether />
        </div>
      </ShadowBox> */}

      <MainCalendarSection />

      {/* <MainMenuSection items={menuItems} /> */}

      {deferBelowFold && belowFoldContent ? (
        belowFoldContent
      ) : (
        <>
          <MainSectionSkeleton variant="room" />
          <MainSectionSkeleton variant="ranking" />
        </>
      )}

      {isModalOpen && <AlarmModal onClose={handleCloseModal} />}
      {/* 하단 네비게이션 */}
    </>
  );
};

export default MainPage;
