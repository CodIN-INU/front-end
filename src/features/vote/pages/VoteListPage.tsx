'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { GetVoteData } from '@/features/vote/api/getVoteData';
import { PostVoting } from '@/features/vote/api/postVoting';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Link from 'next/link';
import ShadowBox from '@/components/common/shadowBox';
import Title from '@/components/common/title';
import clsx from 'clsx';
import type { VoteListItem } from '@/api/server';

interface VoteListPageProps {
  initialVotes?: VoteListItem[];
  initialNextPage?: number;
}

interface VoteData {
  post: {
    title: string;
    content: string;
    likeCount: number;
    scrapCount: number;
    commentCount: number;
    hits: number;
    createdAt: Date | string;
    userInfo: { scrap: boolean; like: boolean };
    anonymous: boolean;
    _id: string;
  };
  poll: {
    pollOptions: string[];
    multipleChoice: boolean;
    pollEndTime: string;
    pollVotesCounts: number[];
    userVoteOptions: string[] | string;
    totalParticipants: number;
    hasUserVoted: boolean;
    pollFinished: boolean;
  };
}

export default function VoteListPage({
  initialVotes = [],
  initialNextPage = -1,
}: VoteListPageProps = {}) {
  const authContext = useContext(AuthContext);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [voteList, setVoteList] = useState<VoteData[]>(
    initialVotes.length > 0 ? (initialVotes as unknown as VoteData[]) : []
  );
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialVotes.length === 0
  );
  const [hasMore, setHasMore] = useState<boolean>(
    initialNextPage >= 0
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number[]>
  >({});

  interface VoteListProps {
    voteList: VoteData[]; // VoteData 타입의 배열
  }
  const handleCheckboxChange = (
    voteId: string,
    index: number,
    multipleChoice: boolean
  ) => {
    setSelectedOptions(prevSelected => {
      const currentSelection = prevSelected[voteId] || [];

      if (multipleChoice) {
        // 여러 개 선택 가능
        if (currentSelection.includes(index)) {
          // 이미 선택된 경우, 선택 해제
          return {
            ...prevSelected,
            [voteId]: currentSelection.filter(item => item !== index),
          };
        } else {
          // 선택되지 않은 경우, 추가
          return { ...prevSelected, [voteId]: [...currentSelection, index] };
        }
      } else {
        // 단일 선택만 가능
        return { ...prevSelected, [voteId]: [index] }; // 하나의 옵션만 선택
      }
    });
  };


  useEffect(() => {
    if (initialVotes.length > 0 && page === 0) return;

    const getVoteData = async (pageNum: number) => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const voteData = await GetVoteData(pageNum) as {
          data?: { contents?: VoteData[] };
        };
        const newVoteData = voteData.data?.contents ?? [];
        if (newVoteData.length === 0) {
          setHasMore(false);
        } else {
          setVoteList(prev => [...newVoteData, ...prev]);
        }
        setIsLoading(false);
      } catch (err) {
        console.log('투표 정보를 불러오지 못했습니다.', err);
        setVoteList([]);
        setIsLoading(false);
      }
    };

    getVoteData(page);
  }, [page]);

  const handleScroll = () => {
    if (!chatBoxRef.current) return;
    const { scrollTop } = chatBoxRef.current;
    if (scrollTop === 0 && hasMore && !isLoading) {
      setPage(prev => prev + 1); // 다음 페이지 요청
    }
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate); // 투표 종료 시간을 Date 객체로 변환
    const now = new Date(); // 현재 시간
    const timeDiff = end.getTime() - now.getTime(); // ms 단위 차이 계산

    // 시간 차이를 일 단위로 변환
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 하루는 1000 * 3600 * 24 ms

    return daysLeft;
  };

  const votingHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    voteId: string
  ) => {
    e.preventDefault();
    if ((selectedOptions[voteId]?.length ?? 0) === 0) {
      alert('투표 옵션을 선택해주세요');
      return;
    }
    try {
      const response = await PostVoting(voteId, selectedOptions[voteId] || []);
      console.log('결과:', response);
      window.location.reload();
    } catch (err) {
      console.error('투표 실패', err);
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        (err.response.data as { message?: string })?.message;
      alert(message);
    }
  };

  // VoteList 컴포넌트: voteList를 받아서 렌더링하는 컴포넌트
  const VoteList = ({ voteList }: VoteListProps) => {
    return (
      <div
        id="voteCont"
        className="w-full"
      >
        {voteList.map((vote, _) => (
          <ShadowBox
            key={`${vote.post._id}${_}`}
            // id="voteIndex"
            className="my-[18px] py-[20px] px-[21px] flex flex-col"
          >
            <Link href={`/vote/${vote.post._id}`}>
              <Title
              // id="voteTitle"
              >
                {vote.post.title}
              </Title>
            </Link>
            <p
              id="voteContent"
              className="text-[14px] font-normal text-sub"
            >
              {vote.post.content}
            </p>
            <div
              id="voteContainer"
              className="flex flex-col"
            >
              {calculateDaysLeft(vote.poll.pollEndTime) > 0 &&
              vote.poll.hasUserVoted === false ? (
                <div className="flex flex-col">
                  <div
                    id="ect"
                    className="text-Mr text-[#404040] flex justify-end gap-[4px]"
                  >
                    <div id="count">{vote.poll.totalParticipants}명 참여</div>
                    {vote.poll.multipleChoice && (
                      <div id="ismulti"> • 복수투표</div>
                    )}
                  </div>
                  <hr className="my-[10px]" />
                  <ul
                    id="ulCont"
                    className="flex flex-col gap-[15px]"
                  >
                    {vote.poll.pollOptions.map((option, i) => (
                      <li
                        id="pollCont"
                        className="flex gap-[16px] items-center justify-start"
                        key={i}
                      >
                        <input
                          type="checkBox"
                          key={i}
                          className="hidden peer"
                          id={`pollOptionCheckBox-${vote.post._id}-${i}`}
                          onChange={() =>
                            handleCheckboxChange(
                              vote.post._id,
                              i,
                              vote.poll.multipleChoice
                            )
                          }
                          checked={
                            selectedOptions[vote.post._id]?.includes(i) || false
                          }
                          disabled={vote.poll.pollFinished}
                        ></input>
                        <label
                          htmlFor={`pollOptionCheckBox-${vote.post._id}-${i}`}
                          className="w-[17px] h-[17px] rounded-full border border-gray-400 flex items-center justify-center cursor-pointer transition-all duration-300 peer-checked:bg-[#0D99FF] peer-checked:border-[#0D99FF] relative"
                        >
                          <img
                            src="/icons/board/check.svg"
                            className="w-[9px] text-white text-[10px] transition-opacity duration-300"
                          />
                        </label>
                        <p
                          id="optionText1"
                          className="text-Mr"
                        >
                          {option}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <button
                    id="voteBtn"
                    className={clsx(
                      'mt-[15px] mb-[4px]',
                      selectedOptions[vote.post._id]?.length !== 0
                        ? 'w-full rounded-[5px] bg-[#0D99FF] py-[8px] text-Mm text-white'
                        : 'w-full rounded-[5px] bg-sub py-[8px] text-Mm text-sub'
                    )}
                    disabled={selectedOptions[vote.post._id]?.length === 0}
                    onClick={e => votingHandler(e, vote.post._id)}
                  >
                    투표하기
                  </button>
                </div>
              ) : (
                <div id="conT">
                  <div
                    id="ect"
                    className="text-Mr text-[#404040] flex justify-end gap-[4px]"
                  >
                    <div id="count">{vote.poll.totalParticipants}명 참여</div>
                    {vote.poll.multipleChoice && (
                      <div id="ismulti"> • 복수투표</div>
                    )}
                  </div>
                  <hr className="my-[10px]" />
                  {vote.poll.pollOptions.map((option, i) => (
                    <li
                      key={i}
                      id="pollOpCont"
                      className="list-none flex-col"
                    >
                      <div
                        id="cont1"
                        className="flex justify-between"
                      >
                        <p
                          id="optionText"
                          className="text-Mr"
                        >
                          {option}
                        </p>
                        <div
                          id="optionCount"
                          className="text-sr text-sub"
                        >
                          {vote.poll.pollVotesCounts[i]}명
                        </div>
                      </div>

                      <div
                        id="statusbar"
                        className="w-full bg-gray h-[13px] rounded-full mb-[12px] mt-[6px]"
                      >
                        <div
                          id="pollOptionBar"
                          className={clsx(
                            'h-full rounded-full',
                            vote.poll.pollVotesCounts[i] === 0
                              ? 'bg-[#AEAEAE]'
                              : 'bg-main'
                          )}
                          style={{
                            width: `${Math.floor(
                              (vote.poll.pollVotesCounts[i] /
                                vote.poll.totalParticipants) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sr text-sub mt-[8px]">
              <div className="flex space-x-[6px]">
                <span className="flex items-center gap-[4.33px]">
                  <img
                    src="/icons/board/viewIcon.svg"
                    width={16}
                    height={16}
                  />
                  {vote.post.hits || 0}
                </span>
                <span className="flex items-center gap-[4.33px]">
                  <img
                    src="/icons/board/heartIcon.svg"
                    width={16}
                    height={16}
                  />
                  {vote.post.likeCount || 0}
                </span>
                <span className="flex items-center gap-[4.33px]">
                  <img
                    src="/icons/board/commentIcon.svg"
                    width={16}
                    height={16}
                  />
                  {vote.post.commentCount || 0}
                </span>
              </div>
              <div
                id="pollEndTime"
                className="text-sr text-sub mr-[8px]"
              >
                {calculateDaysLeft(vote.poll.pollEndTime) > 0 ? (
                  <>{calculateDaysLeft(vote.poll.pollEndTime)}일 후 종료</>
                ) : (
                  '종료됨'
                )}
              </div>
            </div>
          </ShadowBox>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Header
        showBack
        title={`익명 투표`}
        tempBackOnClick='/boards'
      />
      <DefaultBody headerPadding="compact">
        <div
          id="VoteListCont"
          className="w-full"
          ref={chatBoxRef}
          onScroll={handleScroll}
        >
          {isLoading && <div className="loading">Loading...</div>}
          <VoteList voteList={voteList} />
        </div>
        <Link
          href={`/write/vote`}
          className="fixed bottom-[108px] right-[17px] bg-main text-white rounded-full shadow-lg p-4 hover:bg-blue-600 transition duration-300"
          aria-label="글쓰기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.80002 14.5999L8.00002 18.1999M3.20002 14.5999L15.0314 2.35533C16.3053 1.08143 18.3707 1.08143 19.6446 2.35533C20.9185 3.62923 20.9185 5.69463 19.6446 6.96853L7.40002 18.7999L1.40002 20.5999L3.20002 14.5999Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </DefaultBody>
    </div>
  );
}
