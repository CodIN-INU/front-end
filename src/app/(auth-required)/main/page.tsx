'use client';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import { boardData } from '@/data/boardData';
import AlarmModal from '@/components/modals/AlarmModal'; // 알림 아이콘 추가
import apiClient from '@/api/clients/apiClient';
import ShadowBox from '@/components/common/shadowBox';
import WorkingTogether from '@public/icons/workingTogether.svg'; // 협업 컴포넌트
import DateCalendar from '@/components/calendar/DateCalendar';
import Extra from '@public/icons/main_routing_img/extra.svg';
import Intro from '@public/icons/main_routing_img/intro.svg';
import Search from '@public/icons/main_routing_img/search.svg';
import Ticket from '@public/icons/main_routing_img/ticket.svg';
import RightArrow from '@public/icons/arrow/arrow_right.svg';
import { fetchClient } from '@/api/clients/fetchClient';
import RoomItemHourly from '../roomstatus/components/roomItemHourly';
import { Lecture, LectureDict } from '../roomstatus/interfaces/page_interface';
import { TIMETABLE_LENGTH } from '../roomstatus/constants/timeTableData';
import PageBar from '@/components/Layout/pageBar';

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  }
};

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;
type MenuItem = {
  label: string;
  href: string;
  icon: SvgIcon;
};

const menuItems = [
  {
    label: '정보대 소개',
    href: '/info/department-info/phone',
    icon: Intro as SvgIcon,
  },
  {
    label: '교과목 검색 및 추천',
    href: '/info/courses',
    icon: Search as SvgIcon,
  },
  {
    label: '비교과',
    href: '/boards/extracurricular',
    icon: Extra as SvgIcon,
  },
  {
    label: '간식나눔 티켓팅',
    href: '/ticketing',
    icon: Ticket as SvgIcon,
  },
] satisfies MenuItem[];

const mapPostCategoryToBoardPath = (postCategory: string): string | null => {
  for (const boardKey in boardData) {
    const board = boardData[boardKey];
    const tab = board.tabs.find(tab => tab.postCategory === postCategory);
    if (tab) return boardKey; // 해당 게시판 경로 반환
  }
  return null; // 매칭되는 게시판이 없을 경우
};

const MainPage: FC = () => {
  const [rankingPosts, setRankingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [roomStatus, setRoomStatus] = useState<LectureDict[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [floor, setFloor] = useState<number>(1);

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

  // 메인 페이지가 로딩되었을 때(세션 내 최초)  웹뷰로"LOGIN_SUCCESS" 메시지 전송
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

  useEffect(() => {
    const fetchRankingPosts = async () => {
      try {
        const response = await apiClient.get('/posts/top3');
        setRankingPosts(response.data.dataList || []); // 데이터 구조에 따라 수정
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRankingPosts();
  }, []);

  const getTimeTableData = (listOfLecture: Lecture[]) => {
    let lecture: Lecture;
    let timeTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
    let boundaryTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
    for (lecture of listOfLecture) {
      const start = lecture.startTime;
      const end = lecture.endTime;

      const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
      const startPointer = time.indexOf(start.split(':')[0]);
      const endPointer = time.indexOf(end.split(':')[0]);

      const startMin = parseInt(start.split(':')[1]);
      const endMin = parseInt(end.split(':')[1]);

      let boundary = 0;
      if (startPointer >= 0 && endPointer < 10) {
        for (let i = startPointer; i <= endPointer; i++) {
          for (let j = 0; j <= 4; j++) {
            if (i > startPointer && i < endPointer) {
              timeTable[i * 4 + j] = 1;
            } else if (i === startPointer && j * 15 >= startMin) {
              if (boundary === 0) {
                boundaryTable[i * 4 + j] = 1;
                boundary = 1;
              }
              timeTable[i * 4 + j] = 1;
            } else if (i === endPointer && j * 15 <= endMin) {
              timeTable[i * 4 + j] = 1;
            } else {
              if (boundary === 1) {
                boundaryTable[i * 4 + j - 1] = 1;
                boundary = 0;
                break;
              }
            }
          }
        }
        if (boundary === 1) {
          boundaryTable[endPointer * 4 + 4] = 1;
        }
      }
    }

    return [timeTable, boundaryTable];
  };

  useEffect(() => {
    const fetchMiniRoomStatus = async () => {
      try {
        const response = await fetchClient('/rooms/empty');
        console.log(response);
        if (response.success) {
          setRoomStatus(response.data);
        } else {
          console.error('Failed to fetch room status:', response.message);
        }
      } catch (error) {
        console.error('Error fetching room status:', error);
        // reload the page to retry
        window.location.reload();
      }
    };
    fetchMiniRoomStatus();
  }, []);

  const handleFloorChange = () => {
    setFloor(prev => (prev === 5 ? 1 : prev + 1));
  };

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

      {/* 캘린더 */}
      <div className="font-bold text-[16px] mb-[11px]">정보기술대학 캘린더</div>
      <DateCalendar />

      {/* 메뉴 섹션 */}
      <section className="mt-[32px] relative flex flex-col">
        <div className="flex justify-between gap-y-[24px]">
          {menuItems.map(({ label, href, icon: Icon }, index) => (
            <Link
              href={href}
              key={index}
              className="flex flex-col justify-start items-center text-center text-Mm"
            >
              <div className="w-[61px] h-[61px] bg-white flex items-center justify-center rounded-full shadow-[0px_5px_13.3px_1px_rgba(212,212,212,0.59)]">
                <Icon />
              </div>
              <div className="flex justify-center items-center mt-[3px] w-[61px] h-[30px]">
                <span className="text-sr break-keep leading-[14px] text-[#AEAEAE]">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 강의실 축약 UI */}
      <ShadowBox className="mt-[34px]">
        <div className="flex justify-between pl-[14px] pr-[5px] pt-[23px] pb-[18px] font-bold">
          <div className="text-[16px]">빈 강의실을 찾고 있나요?</div>
          <Link
            href={'/roomstatus/1'}
            className="flex items-center gap-[1px]"
          >
            <span className="text-active text-[12px]">자세히보기</span>
            <RightArrow />
          </Link>
        </div>
        <div className="px-[14px]">
          {roomStatus[floor - 1] &&
            Object.entries(roomStatus[floor - 1])
              .slice(0, 2)
              .map(([roomNum, status]) => {
                const [timeTable, boundaryTable] = getTimeTableData(status);
                return (
                  <div
                    key={roomNum}
                    className="relative flex flex-col w-full py-[5px]"
                  >
                    <RoomItemHourly
                      RoomName={roomNum + '호'}
                      LectureList={status}
                      RoomStatusList={timeTable}
                      BoundaryList={boundaryTable}
                      summaryView
                    />
                  </div>
                );
              })}
        </div>
        <div
          className="flex justify-center py-[22px]"
          onClick={handleFloorChange}
        >
          <PageBar
            value={floor}
            count={5}
          />
        </div>
      </ShadowBox>

      {/* 게시물 랭킹 */}
      <section className="mt-[48px]">
        <h2 className="text-XLm">{'게시물 랭킹'}</h2>
        <div className="pt-[26px] mb-[18px] flex flex-col gap-[27px]">
          {loading ? (
            <p className="text-center text-sub">
              랭킹 데이터를 불러오는 중입니다...
            </p>
          ) : error ? (
            <p className="text-center text-sub">{error}</p>
          ) : rankingPosts.length > 0 ? (
            rankingPosts.map((post, index) => {
              const boardPath = mapPostCategoryToBoardPath(post.postCategory);
              return boardPath ? (
                <Link
                  key={index}
                  href={`/boards/${boardPath}?postId=${post._id}`}
                  className="block"
                >
                  <div className="flex flex-col gap-[8px] bg-white">
                    <div className="flex-1 w-full">
                      <div>
                        <p className="text-sr text-sub px-[4px] py-[2px] bg-[#F2F2F2] rounded-[3px] inline">
                          {boardData[boardPath]?.name || '알 수 없음'}
                        </p>
                      </div>
                      <h3 className="text-Lm mt-[8px]">{post.title}</h3>
                      <p className="text-Mr text-sub mt-[4px] mb-[8px]">
                        {post.content}
                      </p>
                      <div className="flex justify-between items-center text-sr text-sub">
                        <div className="flex space-x-[6px]">
                          <span className="flex items-center gap-[4.33px]">
                            <img
                              src="/icons/board/viewIcon.svg"
                              width={16}
                              height={16}
                              alt="조회수 아이콘"
                            />
                            {post.hits || 0}
                          </span>
                          <span className="flex items-center gap-[4.33px]">
                            <img
                              src="/icons/board/heartIcon.svg"
                              width={16}
                              height={16}
                              alt="좋아요 아이콘"
                            />
                            {post.likeCount || 0}
                          </span>
                          <span className="flex items-center gap-[4.33px]">
                            <img
                              src="/icons/board/commentIcon.svg"
                              width={16}
                              height={16}
                              alt="댓글 아이콘"
                            />
                            {post.commentCount || 0}
                          </span>
                        </div>
                        <div className="flex items-centertext-sub space-x-1 text-sr">
                          <span>{post.anonymous ? '익명' : post.nickname}</span>
                          <span> · </span>
                          <span>{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : null;
            })
          ) : (
            <>
              <p className="text-center text-gray-500">게시물이 없습니다.</p>
            </>
          )}
        </div>
      </section>

      {isModalOpen && <AlarmModal onClose={handleCloseModal} />}
      {/* 하단 네비게이션 */}
    </>
  );
};

export default MainPage;
