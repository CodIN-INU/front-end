'use client';

import { FC, useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchClient } from '@/shared/api/fetchClient';
import {
  eventParticipationProfileResponseList,
  FetchUserResponse,
} from '@/types/snackEvent';
import { formatToMonthDay } from '@/lib/utils/date';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import SearchInput from '@/components/common/SearchInput';
import ChangeStatusModal from '@/features/ticketing/components/modals/ChangeStatusModal';
import ViewUserSignModal from '@/features/ticketing/components/modals/ViewUserSignModal';

const TicketingUserListPage: FC = () => {
  const router = useRouter();
  const { eventId } = useParams();
  const [users, setUsers] = useState<eventParticipationProfileResponseList[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialize, setIsInitialize] = useState<boolean>(false);
  const isFetching = useRef(false);
  const [title, setTitle] = useState<string>('');
  const [eventEndTime, setEventEndTime] = useState<string>('');
  const [stock, setStock] = useState<number>();
  const [waitNum, setWaitNum] = useState<number>();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<eventParticipationProfileResponseList | null>(null);

  // 상태/정렬 필터
  const [statusFilter, setStatusFilter] = useState<
    '전체' | '수령완료' | '미수령'
  >('전체');
  const [sortType, setSortType] = useState<'학과순' | '이름순'>('학과순');
  const [openMenu, setOpenMenu] = useState<null | 'status' | 'sort'>(null);

  useEffect(() => {
    if (!isInitialize) {
      const initialize = async () => {
        setUsers([]);
        setPage(1);
        setHasMore(true);
        setIsInitialize(true);
        await fetchPosts(1);
      };
      initialize();
    }
  }, [isInitialize]);

  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);
    try {
      const response = await fetchClient<FetchUserResponse>(
        `/ticketing/admin/event/${eventId}/participation?page=${pageNumber}`
      );
      const eventList =
        response?.data?.eventParticipationProfileResponseList ?? [];
      setEventEndTime(formatToMonthDay(response.data.eventEndTime));
      setTitle(response.data.title);
      setStock(response.data.stock);
      setWaitNum(response.data.waitNum);

      if (!Array.isArray(eventList)) {
        console.error('참여 목록 형식 오류');
        setHasMore(false);
        return;
      }
      if (eventList.length === 0) {
        setHasMore(false);
      } else {
        setUsers(prev => [...prev, ...eventList]);
      }
    } catch (e) {
      console.error('데이터 불러오기 실패', e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300 &&
        !isLoading &&
        hasMore &&
        !isFetching.current
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  // 1) 검색 필터
  const filteredUsers =
    searchQuery.trim() === ''
      ? users
      : users.filter(user => {
          const keyword = searchQuery.toLowerCase();
          const target =
            `${user.name} ${user.studentId} ${user.department}`.toLowerCase();
          return target.includes(keyword);
        });

  // 2) 상태 필터 (전체/수령완료/미수령)
  const statusFiltered = filteredUsers.filter(u => {
    if (statusFilter === '전체') return true;
    const isDone = Boolean(u.imageURL); // 수령 여부 판단
    return statusFilter === '수령완료' ? isDone : !isDone;
  });

  // 3) 정렬 (학과순/이름순)
  const finalUsers = [...statusFiltered].sort((a, b) => {
    if (sortType === '학과순') {
      const dep =
        a.department?.localeCompare(b.department ?? '', 'ko', {
          sensitivity: 'base',
        }) ?? 0;
      if (dep !== 0) return dep;
      return (a.name ?? '').localeCompare(b.name ?? '', 'ko', {
        sensitivity: 'base',
      });
    } else {
      return (a.name ?? '').localeCompare(b.name ?? '', 'ko', {
        sensitivity: 'base',
      });
    }
  });

  // 사용자 상태 변경
  const changeUserStatus = (user: eventParticipationProfileResponseList) => {
    setSelectedUser(user);
    setShowChangeModal(true);
  };

  const showUserSign = (user: eventParticipationProfileResponseList) => {
    setSelectedUser(user);
    setShowSignModal(true);
  };

  const formatMonthDayFromKoreanDate = (dateStr: string) => {
    const parts = dateStr.split(' ')[0].split('.');
    return `${parts[1]}/${parts[2]}`;
  };

  // 필터 버튼 스타일
  const pillBtn =
    'relative flex items-center gap-2 px-[21px] py-[6.5px] rounded-full bg-[#F9F9F9] text-[#808080] ' +
    'shadow-[0_6px_7.2px_rgba(182,182,182,0.3)] text-[12px] font-medium';

  const menuBase =
    'absolute left-0 top-[112%] rounded-xl bg-[#FAF9F9] shadow-[0_6px_7.2px_rgba(182,182,182,0.3)]  overflow-hidden z-10  flex flex-col items-center w-full';

  const itemCls =
    'w-full text-left px-3 py-2 hover:bg-[#EBF0F7] hover:text-[#0D99FF] text-[12px] text-center text-[#767676]';

  return (
    <Suspense>
      <div className="relative mb-6">
        {/* 참여 인원 / 대기 인원 */}
        <div
          className="
          absolute top-14 left-1/2 -translate-x-1/2
          flex flex-row text-[12px] text-[#0D99FF]
          items-center z-[54]
        "
        >
          참여 인원 {stock} | 대기 인원 {waitNum}
        </div>

        <Header
          showBack
          title={`${eventEndTime} ${title}`}
          showDownload={{
            endpoint: `/ticketing/ticketing/excel/${eventId}`,
            filename: `${eventEndTime} ${title} 참여자 목록`,
            method: 'GET',
          }}
        />
      </div>

      <DefaultBody headerPadding="compact">
        {isLoading && users.length === 0 && (
          <div className="text-center my-4 text-gray-500">로딩 중..</div>
        )}
        {!hasMore && !isLoading && users.length === 0 && (
          <div className="text-center my-4 text-gray-500">
            참여자가 없습니다.
          </div>
        )}

        <SearchInput
          placeholder="이름 또는 학번 검색"
          onChange={query => setSearchQuery(query)}
        />

        {/* 필터/정렬 영역 */}
        <div className="mt-[33px] mb-[30px] flex gap-2 self-end">
          {/* 상태 필터 */}
          <div className="relative">
            <button
              type="button"
              className={pillBtn}
              onClick={() =>
                setOpenMenu(openMenu === 'status' ? null : 'status')
              }
            >
              <span className="text-[10px]">▼</span>
              <span>{statusFilter}</span>
            </button>
            {openMenu === 'status' && (
              <div className={menuBase}>
                {(['전체', '수령완료', '미수령'] as const).map(opt => (
                  <button
                    key={opt}
                    className={itemCls}
                    onClick={() => {
                      setStatusFilter(opt);
                      setOpenMenu(null);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 정렬 방식 */}
          <div className="relative">
            <button
              type="button"
              className={pillBtn}
              onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
            >
              <span className="text-[10px]">▼</span>
              <span>{sortType === '학과순' ? '학과순' : '이름순'}</span>
            </button>
            {openMenu === 'sort' && (
              <div className={menuBase}>
                {(['학과순', '이름순'] as const).map(opt => (
                  <button
                    key={opt}
                    className={itemCls}
                    onClick={() => {
                      setSortType(opt);
                      setOpenMenu(null);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full border-b-[1px] border-[#d4d4d4]">
          {finalUsers.map((user, index) => (
            <div
              key={user.userId}
              className="bg-white py-[6px] flex flex-row border-t-[1px] border-[#d4d4d4] items-center"
            >
              <div className="text-[16px] font-bold text-[#79797B] text-center border-r-[1px] border-[#d4d4d4] p-[21px]">
                {String(index + 1).padStart(3, '0')}
              </div>

              <div className="flex flex-col items-center ml-2 flex-1">
                <span className="text-[12px] text-[#79797B]">
                  {user.department}
                </span>
                <span className="text-[14px] font-bold text-[#79797B]">
                  {user.name}
                </span>
                <span className="text-[12px] font-bold text-[#0D99FF]">
                  {user.studentId}
                </span>
              </div>

              <div>
                {user.imageURL ? (
                  <button
                    className="bg-[#0D99FF] text-white text-[14px] rounded-full px-3 py-[7px]"
                    onClick={() => showUserSign(user)}
                  >
                    수령 완료
                  </button>
                ) : (
                  <span
                    className="bg-[#EBF0F7] text-[#808080] text-[14px] rounded-full px-3 py-[7px]"
                    onClick={() => changeUserStatus(user)}
                  >
                    수령 대기
                  </span>
                )}
              </div>
            </div>
          ))}

          {showChangeModal && selectedUser && (
            <ChangeStatusModal
              userInfo={selectedUser}
              eventId={String(eventId)}
              onClose={() => setShowChangeModal(false)}
              onComplete={() => {
                setShowChangeModal(false);
                window.location.reload();
              }}
            />
          )}

          {showSignModal && selectedUser && (
            <ViewUserSignModal
              userInfo={selectedUser}
              onClose={() => setShowSignModal(false)}
              onComplete={() => {
                setShowSignModal(false);
                window.location.reload();
              }}
            />
          )}
        </div>
      </DefaultBody>
    </Suspense>
  );
};

export default TicketingUserListPage;
