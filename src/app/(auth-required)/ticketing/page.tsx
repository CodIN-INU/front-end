'use client';

import { FC, useState, useEffect, useRef } from "react";
import { boardData } from "@/data/boardData";
import BoardLayout from "@/components/Layout/BoardLayout";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/api/clients/fetchClient";
import { SnackEvent, FetchSnackResponse } from "@/interfaces/SnackEvent";
import { formatDateTimeWithDay } from '@/utils/date';

const TicketingPage: FC = () => {
  const board = boardData['ticketing'];
  const router = useRouter();
  const { tabs } = board;
  const defaultTab = tabs.length > 0 ? tabs[0].value : "default";

  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [snacks, setSnacks] = useState<SnackEvent[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isFetching = useRef(false);

  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const activePostCategory =
        tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

      const response = await fetchClient<FetchSnackResponse>(
        `/ticketing/event?campus=${activePostCategory}&page=${pageNumber}`
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
    if (page > 0) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <BoardLayout
      board={board}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      showSearchButton={false}
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
            className="relative rounded-[15px] py-[29px] flex flex-col
                shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)]
                cursor-pointer "
            onClick={() => {if (snack.eventStatus !== 'ENDED') { router.push(`/ticketing/${snack.eventId}`)}
            }}
          >
            {/* 오버레이: 이벤트 종료 시 */}
              {snack.eventStatus === 'ENDED' && (
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.18)] rounded-[15px] z-20 cursor-not-allowed" />
              )}
            <div className="flex flex-col items-center px-4">
              <div className="flex items-start mb-[13px] w-full">
                <p className="font-semibold text-[14px]">{snack.eventTitle}</p>
                <p className="text-[25px] text-[#0D99FF] mt-[-17px]"> •</p>
              </div>
              <div className="flex flex-row justify-center items-start w-full">
                <div className="flex flex-col justify-start w-full">
                  <div className="mt-[5px] text-[12px] text-black">{formatDateTimeWithDay(snack.eventEndTime)}</div>
                  <div className="text-[12px] text-black">{snack.locationInfo}</div>
                  <div className="text-[12px] text-black">{snack.quantity}명</div>
                  <div className="text-[12px] text-[#0D99FF]">티켓팅 오픈: {formatDateTimeWithDay(snack.eventTime)}</div>
                </div>
                <img src={snack.eventImageUrl} className="w-[93px] h-[93px] border border-1 border-[#d4d4d4] rounded-[10px] p-2 ml-[23px]"></img>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BoardLayout>
  );
};

export default TicketingPage;
