'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import apiClient from '@/api/clients/apiClient'; // 공통 apiClient 불러오기
import { PostChatRoom } from '@/api/chat/postChatRoom';
import { PostVoting } from '@/api/vote/postVoting';
import { GetVoteDetail } from '@/api/vote/getVoteDetail';
import { PostBlockUser } from '@/api/user/postBlockUser';
import { useParams } from 'next/navigation';
import { PostLike } from '@/api/like/postLike';
import Header from '@/components/Layout/header/Header';
import CommentSection from '@/components/comment/CommentSection';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import ReportModal from '@/components/modals/ReportModal'; // ReportModal 컴포넌트 임포트
import { useReportModal } from '@/hooks/useReportModal';
import { DeletePost } from '@/api/boards/deletePost';
import MenuItem from '@/components/common/Menu/MenuItem';

export default function VoteDetail() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [vote, setVote] = useState<vote | null>(null);
  const { voteId } = useParams();
  const [isPostLiked, setIsPostLiked] = useState<{ [key: string]: boolean }>(
    {}
  ); // 수정: 객체로 변경    const [isCommentLiked, setIsCommentLiked] = useState<{ [key: string]: boolean }>({});
  const [likeCount, setLikeCount] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  interface vote {
    title: string;
    content: string;
    likeCount: number;
    scrapCount: number;
    commentCount: number;
    hits: number;
    createdAt: Date;
    userInfo: {
      scrap: boolean;
      like: boolean;
      mine: boolean;
    };
    userImageUrl: string;
    nickname: string;
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
    anonymous: boolean;
    userId: string;
    _id: string;
  }

  useEffect(() => {
    if (!voteId) {
      console.error('voteId가 URL에 존재하지 않습니다');
    }
  }, [voteId]);

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
    if (!voteId) return;

    const getVoteData = async () => {
      try {
        const voteData = await GetVoteDetail(voteId);

        const voteInfo = voteData.data;
        setVote(voteInfo);

        const initialPostLike = {
          [voteInfo._id]: voteInfo.userInfo.like, // 게시물에 대한 좋아요 상태 설정
        };
        setIsPostLiked(initialPostLike); // 게시물 좋아요 상태 초기화
      } catch (error) {
        console.log('투표 정보를 불러오지 못했습니다.', error);
      }
    };

    getVoteData();
  }, [voteId]);

  // 좋아요 및 북마크 토글 함수
  const toggleAction = async (action: 'like' | 'bookmark') => {
    try {
      // API 요청 URL 및 데이터 설정
      const url = action === 'like' ? '/likes' : `/scraps/${voteId}`;
      const requestData =
        action === 'like' ? { likeType: 'POST', likeTypeId: vote?._id } : undefined;

      // API 호출
      const response = await apiClient.post(url, requestData);
      console.log(response.data);

      if (response.data.success && vote) {
        setVote({
          ...vote,
          userInfo: {
            ...vote.userInfo,
            [action === 'like' ? 'like' : 'scrap']:
              !vote.userInfo[action === 'like' ? 'like' : 'scrap'],
          },
          likeCount:
            action === 'like'
              ? vote.userInfo.like
                ? vote.likeCount - 1
                : vote.likeCount + 1
              : vote.likeCount,
          scrapCount:
            action === 'bookmark'
              ? vote.userInfo.scrap
                ? vote.scrapCount - 1
                : vote.scrapCount + 1
              : vote.scrapCount,
        });
      } else {
        console.error(
          response.data.message ||
            `${action === 'like' ? '좋아요' : '북마크'} 실패`
        );
      }
    } catch (error) {
      console.error(
        `${action === 'like' ? '좋아요' : '북마크'} 토글 실패`,
        error
      );
    }
  };

  // 종료까지 남은 시간 계산 함수
  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate); // 투표 종료 시간을 Date 객체로 변환
    const now = new Date(); // 현재 시간
    const timeDiff = end.getTime() - now.getTime(); // ms 단위 차이 계산

    // 시간 차이를 일 단위로 변환
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 하루는 1000 * 3600 * 24 ms

    return daysLeft;
  };

  //투표 실행 핸들러
  const votingHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    voteId: string
  ) => {
    e.preventDefault();
    
    if(selectedOptions.length === 0) {alert('투표 옵션을 선택해주세요');}

    else try {
      const response = await PostVoting(voteId, selectedOptions[voteId] || []);
      console.log('결과:', response);
      window.location.reload();
    } catch (error) {
      console.error('투표 실패', error);
      const message = error.response.data.message;
      alert(message);
    }
  };

  const blockUser = async () => {
    try {
      if (
        confirm(
          '해당 유저의 게시물이 목록에 노출되지 않으며, 다시 해제하실 수 없습니다.'
        )
      ) {
        await PostBlockUser(vote.userId);
        alert('유저를 차단하였습니다');
      }
    } catch (error) {
      console.log('유저 차단에 실패하였습니다.', error);
      const message = error.response?.data?.message;
      alert(message);
    }
  };

  const startChat = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await PostChatRoom(vote.title, vote.userId, vote._id);

      console.log('채팅방 생성이 완료되었습니다');
      if (response?.data.data.chatRoomId) {
        window.location.href = `/chat`;
      } else {
        throw new Error('Chat room ID is missing in the response.');
      }
    } catch (error) {
      console.log('채팅방 생성에 실패하였습니다.', error);
    }
  };

  const deletePost = async () => {
    try {
      if (confirm('정말로 게시물을 삭제하시겠습니까?')) {
        await DeletePost(vote._id);
        alert('게시물이 삭제되었습니다.');
      }
    } catch (error) {
      console.log('게시물 삭제에 실패하였습니다.', error);
      const message = error.response?.data?.message;
      alert(message);
    }
  };

  const {
    isOpen: isReportModalOpen,
    openModal: openReportModal,
    closeModal: closeReportModal,
    getModalComponent: getReportModalComponent,
  } = useReportModal();

  const handleMenuAction = (action: string) => {
    if (action === 'chat') {
      alert('채팅하기 클릭됨');
      startChat();
    } else if (action === 'report') {
      openReportModal('POST', vote._id);
    } else if (action === 'block') {
      blockUser();
    } else if (action === 'delete') {
      deletePost();
    }
    setMenuOpen(false);
  };

  return (
    <div className="vote w-full">
      <Header
        showBack
        title="투표 게시글"
        tempBackOnClick="/boards"
        MenuItems={() =>
          vote?.userInfo.mine ? (
            <MenuItem onClick={() => handleMenuAction('delete')}>
              삭제하기
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => handleMenuAction('chat')}>
                채팅하기
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('report')}>
                신고하기
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('block')}>
                차단하기
              </MenuItem>
            </>
          )
        }
      />
      <DefaultBody hasHeader={1}>
        {/* 프로필 */}
        <div className="flex items-center space-x-[12px] mb-[20px]">
          <div className="w-[36px] h-[36px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {vote?.anonymous ? (
              <img
                src="/images/anonymousUserImage.png" // 정적 경로의 익명 이미지
                alt="Anonymous profile"
                className="w-full h-full object-cover"
              />
            ) : vote?.userImageUrl ? (
              <img
                src={vote?.userImageUrl}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-sm">No Image</span>
            )}
          </div>

          <div>
            <h4 className="text-sm">
              {vote?.anonymous ? '익명' : vote?.nickname || '익명'}
            </h4>
            <p className="text-sr text-sub">{`${vote?.createdAt}`}</p>
          </div>
        </div>

        {/* 스크롤 되는 부분 */}
        <div id="voteCont">
          {/* 투표 컨테이너 */}
          {vote && (
            <div
              id="voteIndex"
              className=" flex flex-col gap-[4px]"
            >
              <h3
                id="voteTitle"
                className="text-[16px] font-medium"
              >
                {vote.title}
              </h3>

              <p
                id="voteContent"
                className="text-[14px] font-normal"
              >
                {vote.content}
              </p>

              <div
                id="voteContainer"
                className="mt-[8px] rounded-[15px] border-[1px] flex flex-col px-[24px] py-[16px]"
              >
                {calculateDaysLeft(vote.poll.pollEndTime) > 0 &&
                !vote.poll.hasUserVoted ? ( //투표 기간이 종료되지 않았거나 유저가 아직 투표를 하지 않았을때
                  <>
                    <ul id="ulCont">
                      {vote.poll.pollOptions.map((option, i) => (
                        <li
                          key={i}
                          id="pollCont"
                          className="flex gap-[16px] mb-4 items-center justify-start"
                        >
                          <input
                            type="checkBox"
                            key={i}
                            className="hidden peer"
                            id={`pollOptionCheckBox-${vote._id}-${i}`}
                            onChange={() =>
                              handleCheckboxChange(
                                vote._id,
                                i,
                                vote.poll.multipleChoice
                              )
                            }
                            checked={
                              selectedOptions[vote._id]?.includes(i) || false
                            }
                            disabled={vote.poll.pollFinished}
                          ></input>
                          <label
                            htmlFor={`pollOptionCheckBox-${vote._id}-${i}`}
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
                      className={
                        selectedOptions[vote._id]?.length !== 0
                          ? 'w-full rounded-[5px] bg-[#0D99FF] py-[8px] text-Mm text-white'
                          : 'w-full rounded-[5px] bg-sub py-[8px] text-Mm text-sub'
                      }
                      disabled={selectedOptions[vote._id]?.length === 0}
                      onClick={e => votingHandler(e, vote._id)}
                    >
                      투표하기
                    </button>
                  </>
                ) : (
                  // 투표 기간이 만료되었거나 유저가 투표를 완료하였을 때
                  <div id="conT">
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
                          className="w-full bg-gray h-[4px] rounded-full mb-[12px] mt-[8px]"
                        >
                          <div
                            id="pollOptionBar"
                            className="bg-main h-full rounded-full"
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

                {/* 기타 투표 정보 */}
                <div
                  id="ect"
                  className="text-Mr text-[#404040] flex gap-[4px] mt-[8px]"
                >
                  <div id="count">{vote.poll.totalParticipants}명 참여</div>
                  {vote.poll.multipleChoice && (
                    <div id="ismulti"> • 복수투표</div>
                  )}
                </div>
              </div>

              <div
                id="pollEndTime"
                className="text-sr text-sub ml-[4px] mb-[12px] mt-[6px]"
              >
                {calculateDaysLeft(vote.poll.pollEndTime) > 0 ? (
                  <>{calculateDaysLeft(vote.poll.pollEndTime)}일 후 종료</>
                ) : (
                  '종료됨'
                )}
              </div>

              <div className="flex justify-between items-center text-sr text-sub">
                <div className="flex space-x-[12px]">
                  <span className="flex items-center gap-[4.33px]">
                    <img
                      src={'/icons/board/viewIcon.svg'}
                      width={16}
                      height={16}
                    />
                    {vote.hits || 0}
                  </span>
                  <button
                    onClick={() => toggleAction('like')}
                    className="flex items-center gap-[4.33px]"
                  >
                    <img
                      src={
                        vote.userInfo.like
                          ? '/icons/board/active_heartIcon.svg'
                          : '/icons/board/heartIcon.svg'
                      }
                      width={16}
                      height={16}
                    />
                    {vote.likeCount || 0}
                  </button>
                  <span className="flex items-center gap-[4.33px]">
                    <img
                      src="/icons/board/commentIcon.svg"
                      width={16}
                      height={16}
                    />
                    {vote.commentCount || 0}
                  </span>
                </div>

                <button
                  onClick={() => toggleAction('bookmark')}
                  className="flex items-centertext-sub gap-[4.33px]"
                >
                  <img
                    src={
                      vote.userInfo.scrap
                        ? '/icons/board/active_BookmarkIcon.svg'
                        : '/icons/board/BookmarkIcon.svg'
                    }
                    width={16}
                    height={16}
                    className={`w-[16px] h-[16px] ${
                      vote.userInfo.scrap ? 'text-yellow-300' : 'text-gray-500'
                    }`}
                  />
                  <span>{vote.scrapCount}</span>
                </button>
              </div>

              <div id="divider"></div>
            </div>
          )}
          <CommentSection
            postId={voteId.toString()}
            postName={vote?.title}
          />
        </div>
      </DefaultBody>
    </div>
  );
}
