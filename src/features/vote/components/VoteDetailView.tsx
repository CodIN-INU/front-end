'use client';

import CommentSection from '@/features/comment/components/CommentSection';
import {
  PostDetailActions,
  PostDetailHeader,
} from '@/features/board/components/post/PostDetail';
import { PostDetailViewCount } from '@/features/board/components/post/PostDetail/PostDetailViewCount';
import { DefaultBody, Header, MenuItem } from '@/shared/ui';
import { useReportModal } from '@/shared/hooks/useReportModal';
import type { VoteDetail } from '@/server';
import { useVoteDetail } from '../hooks/useVoteDetail';
import { VoteDetailPoll } from './VoteDetailPoll';

interface VoteDetailViewProps {
  voteId?: string;
  initialVote?: VoteDetail | null;
}

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <h2 className="text-xl font-semibold text-gray-700">로딩 중...</h2>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
  </div>
);

/** 투표 상세 (헤더·프로필·투표 UI·조회·좋아요·댓글) */
export default function VoteDetailView({
  voteId: voteIdProp,
  initialVote,
}: VoteDetailViewProps) {
  const {
    voteId,
    vote,
    loading,
    error,
    selectedOptions,
    toggleLike,
    toggleBookmark,
    adjustCommentCount,
    handleCheckboxChange,
    votingHandler,
    copyLink,
    shareKakao,
    blockUser,
    startChat,
    deletePost,
  } = useVoteDetail({ voteId: voteIdProp, initialVote });

  const { openModal: openReportModal, getModalComponent: getReportModalComponent } =
    useReportModal();

  const handleMenuAction = (action: string) => {
    if (action === 'chat') {
      alert('채팅하기 클릭됨');
      void startChat();
    } else if (action === 'report') {
      openReportModal('POST', vote?.post?._id ?? '');
    } else if (action === 'block') {
      void blockUser();
    } else if (action === 'delete') {
      void deletePost();
    } else if (action === 'share-kakao') {
      shareKakao();
    } else if (action === 'copy-link') {
      copyLink();
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!vote) {
    return <ErrorState message="투표를 찾을 수 없습니다." />;
  }

  const postForActions = {
    userInfo: {
      like: vote.post.userInfo.like,
      scrap: vote.post.userInfo.scrap,
      mine: vote.post.userInfo.mine ?? false,
    },
    likeCount: vote.post.likeCount,
    commentCount: vote.post.commentCount,
    scrapCount: vote.post.scrapCount,
  };

  return (
    <div className="vote w-full">
      <Header
        showBack
        title="투표 게시글"
        tempBackOnClick="/vote"
        MenuItems={() =>
          vote.post.userInfo.mine ? (
            <>
              <MenuItem onClick={() => handleMenuAction('delete')}>
                삭제하기
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('share-kakao')}>
                카카오톡 공유하기
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('copy-link')}>
                링크 복사하기
              </MenuItem>
            </>
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
              <MenuItem onClick={() => handleMenuAction('share-kakao')}>
                카카오톡 공유하기
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('copy-link')}>
                링크 복사하기
              </MenuItem>
            </>
          )
        }
      />
      <DefaultBody headerPadding="compact">
        <div className="bg-white min-h-screen flex justify-center">
          <div className="w-full min-w-0 max-w-[500px]">
            <PostDetailHeader post={vote.post} />
            <div id="voteCont">
              <VoteDetailPoll
                vote={vote}
                selectedOptions={selectedOptions}
                onCheckboxChange={handleCheckboxChange}
                onVoteSubmit={votingHandler}
              />
              <div className="mb-[24px]">
                <PostDetailViewCount hits={vote.post.hits ?? 0} />
              </div>
              <PostDetailActions
                post={postForActions}
                onLike={toggleLike}
                onBookmark={toggleBookmark}
              />
              <CommentSection
                postId={vote.post._id || voteId}
                postName={vote.post.title}
                onCommentCountChange={adjustCommentCount}
              />
            </div>
          </div>
        </div>
      </DefaultBody>
      {getReportModalComponent()}
    </div>
  );
}
