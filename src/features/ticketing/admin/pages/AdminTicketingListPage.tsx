'use client';

import { FC, useState, useEffect, useRef } from "react";
import { boardData } from "@/data/boardData";
import BoardLayout from "@/components/Layout/BoardLayout";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/shared/api/fetchClient";
import { SnackEvent, FetchSnackResponse } from "@/types/snackEvent";
import { formatDateTimeWithDay } from '@/lib/utils/date';
import ChangeEventCheckModal from '@/features/ticketing/components/modals/ChangeEventCheckModal';
import Link from 'next/link';


const AdminTicketingListPage: FC = () => {
  const board = boardData['ticketingAdmin'];
  const router = useRouter();
  const { tabs } = board;
  const defaultTab = tabs.length > 0 ? tabs[0].value : "default";
  const [showChangeEventModal, setShowChangeEventModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [snacks, setSnacks] = useState<SnackEvent[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<number>();
  const [changeEventStatus, setChangeEventStatus]= useState<string>('');
  const isFetching = useRef(false);
  const [isSelected, setIsSelected] = useState<'info' | 'note'>('info')

  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const activePostCategory =
        tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

      const response = await fetchClient<FetchSnackResponse>(
        `/ticketing/admin/event/list?status=${activePostCategory}&page=${pageNumber}`
      );
      console.log(response)
      const eventList = response?.data?.eventList;
      if (!Array.isArray(eventList)) {
        console.error('eventList 형식이 올바르지 않습니다:', eventList);
        setHasMore(false);
        return;
      }

      if (eventList.length === 0) {
        setHasMore(false);
      } else {
        setSnacks((prev) => [...prev, ...eventList]);
      }

    } catch (e) {
      console.error("데이터를 불러오지 못했습니다.", e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  // 초기 로드
  useEffect(() => {
    const initialize = async () => {
      setSnacks([]);
      setPage(1);
      setHasMore(true);
      await fetchPosts(1);
    };

    initialize();
  }, [activeTab]);

  // 스크롤 감지
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

  // 페이지 변경 시 fetch
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const changeEvent = (eventId: number, status: string) => {
    setSelectedEvent(eventId);
    setChangeEventStatus(status);
    setShowChangeEventModal(true);
  }

  const handleDelete = async (eventId: number) => {
     
    const ok = confirm('삭제하시겠습니까?');

    if (!ok) return;
    
      try{
        const res = await fetchClient(`/ticketing/admin/event/${eventId}`, {method: 'DELETE'})
        console.log('삭제 결과:', res);
          alert("삭제 완료");
          window.location.reload();
      } catch (error: any) {
          alert(`삭제 실패 :${error.message}`);
      }
  
}

  return (
    <BoardLayout
      board={board}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      showSearchButton={false}
      showReloadButton={true}
      backOnClick='/main'
    >
      {isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">로딩 중..</div>
      )}

      {!hasMore && !isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">등록된 이벤트가 없습니다.</div>
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
                
                  router.push(`/admin/ticketing/${snack.eventId}`);
                
              }}
            >
              {/* 종료된 이벤트: 반투명 오버레이 */}
              {snack.eventStatus === 'ENDED' && (
                <div className=" pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.18)] rounded-[15px] z-20 " />
              )}
            <img src={snack.eventImageUrl} className="w-[93px] h-[93px] border border-[#d4d4d4] rounded-[10px] p-2 mr-[14px]"></img>
            <div className="flex flex-col items-start">
                <div className="flex items-start">
                <p className="font-semibold text-[14px]">{snack.eventTitle}</p>
                <p className="text-[25px] text-[#0D99FF] mt-[-17px]">•</p>
                </div>
                <div className="mt-[22px] text-[12px] text-black">{snack.eventEndTime}</div>
                <div className="text-[12px] text-black">{snack.locationInfo}</div>
                <div className="text-[12px] text-[#0D99FF]">참여 인원 {snack.currentQuantity} | 대기 인원 {snack.waitQuantity} </div>
                
                {/* 액션 버튼 */}
                    {snack && (
                        <div className="w-full bg-white flex justify-start">
                            {snack.eventStatus === 'ACTIVE' && (
                              <div>
                                <button className="bg-[#0D99FF] rounded-[20px] justify-center items-center py-[7px] gap-[10px] text-[14px] text-[#ffffff] w-[135px] mt-[9px]" 
                                        onClick={(e)=> {
                                          e.stopPropagation();
                                          changeEvent(snack.eventId, 'close');                                          
                                        }}>
                                    이벤트 종료
                                </button>
                                <button className="w-[81px] h-[34px] border border-[#D4D4D4] rounded-[20px] font-notosans font-medium text-[14px] leading-[17px] text-center text-[#AEAEAE] ml-[5px]"
                                  onClick={(e)=>{e.stopPropagation(); router.push(`/admin/ticketing/${snack.eventId}/edit`)}}>
                                  수정
                                </button>
                              </div>
                                
                            )}

                            {snack.eventStatus === 'UPCOMING' && (
                              <div>
                                <button className="bg-[#EBF0F7] rounded-[20px] text-[14px] text-[#808080] mt-[9px] px-[19px] py-[7px]"
                                        onClick={(e)=> {
                                          e.stopPropagation();
                                          changeEvent(snack.eventId, 'open');
                                        }}>
                                    이벤트 시작하기
                                </button>
                                <button className="w-[81px] h-[34px] border border-[#D4D4D4] rounded-[20px] font-notosans font-medium text-[14px] leading-[17px] text-center text-[#AEAEAE] ml-[5px]"
                                  onClick={(e)=>{e.stopPropagation(); router.push(`/admin/ticketing/${snack.eventId}/edit`)}}>
                                  수정
                                </button>
                              </div>
                            )}

                            {snack.eventStatus === 'ENDED' && (
                              <div>
                                <button className="bg-[#A6A6AB] rounded-[20px] text-[14px] text-[#808080] mt-[9px] px-[40px] py-[7px]" disabled>
                                    종료됨
                                </button>
                                 <button className="w-[81px] h-[34px] border border-[#cc5656] rounded-[20px] font-notosans font-medium text-[14px] leading-[17px] text-center text-[#e40000] ml-[5px]"
                                  onClick={()=>handleDelete(snack.eventId)}>
                                  삭제
                                </button>
                                
                            
                              </div>
                            )}
                        </div>                         
                    )}
                    
                </div>
          </div>
        ))}

        <div className="absolute right-[78px]">
        <Link
          href={`/admin/ticketing/create`}
          className="fixed bottom-[108px] bg-main text-white rounded-full shadow-lg p-4 hover:bg-blue-600 transition duration-300 z-30"
          aria-label="새 이벤트 추가"
        >
          <svg
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.27281 18.6122V10.8362H0.00081259V7.81218H7.27281V0.000173807H10.4768V7.81218H17.7848V10.8362H10.4768V18.6122H7.27281Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>

        {showChangeEventModal && selectedEvent && (
            <ChangeEventCheckModal
              eventId={selectedEvent}
              status={changeEventStatus}
              onClose={() => setShowChangeEventModal(false)}
              onComplete={() => {
                setShowChangeEventModal(false);
                window.location.reload();
              }}
            />
          )}
      </div>
    </BoardLayout>
  );
};

export default AdminTicketingListPage;
