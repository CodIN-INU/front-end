'use client';

import { FC, useState, useEffect, useRef } from "react";
import { boardData } from "@/data/boardData";
import BoardLayout from "@/components/Layout/BoardLayout";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/api/clients/fetchClient";
import { MySnackEvent, FetchMySnackResponse } from "@/interfaces/SnackEvent";
import CancelModal from '@/components/modals/ticketing/CancelModal';
import { convertToKoreanDate } from "@/utils/convertToKoreanDate";

const TicketingPage: FC = () => {
  const board = boardData['myTicketing'];
  const router = useRouter();
  const { tabs } = board;
  const defaultTab = tabs.length > 0 ? tabs[0].value : "default";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [snacks, setSnacks] = useState<MySnackEvent[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isFetching = useRef(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [eventId, setEventId] = useState<number>();
  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const activePostCategory =
        tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

      const response = await fetchClient<FetchMySnackResponse>(
        `/ticketing/event/user/status?page=${pageNumber}&status=${activePostCategory}`
      );
      console.log(response)
      const eventList = response?.data?.eventList;
      if (!Array.isArray(eventList)) {
        console.error('eventList가 배열이 아닙니다:', eventList);
        setHasMore(false);
        return;
      }

      if (eventList.length === 0) {
        setHasMore(false);
      } else {
        setSnacks((prev) => [...prev, ...eventList]);
      }

    } catch (e) {
      console.error("이벤트 로딩 실패.", e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  // 초기화
  useEffect(() => {
    const initialize = async () => {
      setSnacks([]);
      setPage(0);
      setHasMore(true);
      await fetchPosts(0);
    };

    initialize();
  }, [activeTab]);

  // 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300 &&
        !isLoading &&
        hasMore &&
        !isFetching.current
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  // 페이지 변경 시
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <BoardLayout
      board={board}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      showSearchButton = {false}
      backOnClick='/mypage'
    >
      {isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">로딩 중...</div>
      )}

      {!hasMore && !isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
      )}

      <div className="flex flex-col gap-[22px] py-[29px] w-full">
        {snacks.map((snack) => (
          <div
              key={snack.eventId}
              className="
                relative rounded-[15px] py-[29px] px-4 flex flex-row
                shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)]
                cursor-pointer
              "
              onClick={() => {
                if (snack.status !== 'COMPLETED') {
                  router.push(`/ticketing/${snack.eventId}`);
                }
              }}
            >
            <img src={snack.eventImageUrl} className="w-[93px] h-[93px] border border-[#d4d4d4] rounded-[10px] p-2 mr-[14px]"></img>
            <div className="flex flex-col items-start">
                <div className="flex items-start">
                    <p className="font-semibold text-[14px]">{snack.title}</p>
                    <p className="text-[25px] text-[#0D99FF] mt-[-17px]"> •</p>
                </div>
                <div className="mt-[22px] text-[12px] text-black">{convertToKoreanDate(snack.eventTime)}</div>
                <div className="text-[12px] text-black">{snack.locationInfo}</div>
                <div className="text-[12px] text-black">티켓팅 완료</div>
                
                {/* 하단 버튼 */}
                    {snack && (
                        <div className="w-full bg-white flex justify-start">
                            {snack.status === 'WAITING' && (
                                <button className="bg-[#0D99FF] rounded-[20px] justify-center items-center py-[7px] gap-[10px] text-[14px] text-[#ffffff] w-[95px] mt-[9px]" 
                                        onClick={(e) => {e.stopPropagation(); setEventId(snack.eventId); setShowCancelModal(true);}}>
                                    티켓팅 취소
                                </button>
                            )}

                            {snack.status === 'CANCELED' && (
                                <button className="bg-[#EBF0F7] rounded-[20px] text-[14px] text-[#808080] mt-[9px] px-[19px] py-[7px]" disabled>
                                    취소 완료
                                </button>
                            )}

                            {snack.status === 'COMPLETED' && (
                                <button className="bg-[#A6A6AB] rounded-[20px] text-[14px] text-[#808080] mt-[9px] px-[40px] py-[7px]" disabled>
                                    사용 완료
                                </button>
                            )}
                        </div>

                        
                    )}
                </div>
          </div>
          
        ))}
      </div>

      {showCancelModal && (
              <CancelModal
                onClose={() => setShowCancelModal(false)}
                eventId={String(eventId)}
              />
            )}
    </BoardLayout>
  );
};

export default TicketingPage;
