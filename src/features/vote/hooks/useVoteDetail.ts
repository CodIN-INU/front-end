'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/shared/api/apiClient';
import { startChat as openOrCreateChatRoom } from '@/features/chat/api/postChatRoom';
import { PostVoting } from '@/features/vote/api/postVoting';
import { GetVoteDetail } from '@/features/vote/api/getVoteDetail';
import { PostBlockUser } from '@/features/auth/api/postBlockUser';
import { DeletePost } from '@/features/board/api/deletePost';
import { useShareActions } from '@/shared/hooks/useShareActions';
import type { VoteDetail } from '@/server';

interface UseVoteDetailOptions {
  voteId?: string;
  initialVote?: VoteDetail | null;
}

export function useVoteDetail({ voteId: voteIdProp, initialVote }: UseVoteDetailOptions) {
  const paramsVoteId = useParams().voteId;
  const voteId =
    voteIdProp ?? (Array.isArray(paramsVoteId) ? paramsVoteId[0] : paramsVoteId);

  const [vote, setVote] = useState<VoteDetail | null>(initialVote ?? null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(!initialVote);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!voteId) {
      console.error('voteId가 URL에 존재하지 않습니다');
    }
  }, [voteId]);

  useEffect(() => {
    if (!voteId) return;

    if (initialVote) {
      setVote(initialVote);
      setError(null);
      setLoading(false);
      return;
    }

    setVote(null);
    setError(null);
    setLoading(true);

    const load = async () => {
      try {
        const voteData = await GetVoteDetail(voteId);
        const voteInfo = voteData.data as VoteDetail;
        if (voteInfo?.post && voteInfo?.poll) {
          setVote(voteInfo);
        } else {
          setError('투표 정보를 불러오지 못했습니다.');
        }
      } catch (e) {
        console.log('투표 정보를 불러오지 못했습니다.', e);
        setError('투표 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [voteId, initialVote]);

  const toggleLike = useCallback(async () => {
    if (!vote) return;
    try {
      const response = await apiClient.post('/likes', {
        likeType: 'POST',
        likeTypeId: vote.post._id,
      });
      if (response.data.success) {
        setVote({
          ...vote,
          post: {
            ...vote.post,
            userInfo: {
              ...vote.post.userInfo,
              like: !vote.post.userInfo.like,
            },
            likeCount: vote.post.userInfo.like
              ? vote.post.likeCount - 1
              : vote.post.likeCount + 1,
          },
        });
      } else {
        console.error(response.data.message || '좋아요 실패');
      }
    } catch (err) {
      console.error('좋아요 토글 실패', err);
    }
  }, [vote]);

  const toggleBookmark = useCallback(async () => {
    if (!vote || !voteId) return;
    try {
      const response = await apiClient.post(`/scraps/${voteId}`);
      if (response.data.success) {
        setVote({
          ...vote,
          post: {
            ...vote.post,
            userInfo: {
              ...vote.post.userInfo,
              scrap: !vote.post.userInfo.scrap,
            },
            scrapCount: vote.post.userInfo.scrap
              ? vote.post.scrapCount - 1
              : vote.post.scrapCount + 1,
          },
        });
      } else {
        console.error(response.data.message || '북마크 실패');
      }
    } catch (err) {
      console.error('북마크 토글 실패', err);
    }
  }, [vote, voteId]);

  const adjustCommentCount = useCallback((delta: number) => {
    setVote(prev => {
      if (!prev) return null;
      return {
        ...prev,
        post: {
          ...prev.post,
          commentCount: Math.max(0, prev.post.commentCount + delta),
        },
      };
    });
  }, []);

  const handleCheckboxChange = useCallback(
    (postId: string, index: number, multipleChoice: boolean) => {
      setSelectedOptions(prevSelected => {
        const currentSelection = prevSelected[postId] || [];

        if (multipleChoice) {
          if (currentSelection.includes(index)) {
            return {
              ...prevSelected,
              [postId]: currentSelection.filter(item => item !== index),
            };
          }
          return { ...prevSelected, [postId]: [...currentSelection, index] };
        }
        return { ...prevSelected, [postId]: [index] };
      });
    },
    []
  );

  const votingHandler = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
      e.preventDefault();

      if ((selectedOptions[postId]?.length ?? 0) === 0) {
        alert('투표 옵션을 선택해주세요');
        return;
      }
      try {
        const response = await PostVoting(postId, selectedOptions[postId] || []);
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
    },
    [selectedOptions]
  );

  const { copyLink, shareKakao } = useShareActions({
    title: vote?.post.title ?? '',
    description: vote?.post.content ?? '투표 게시글',
  });

  const blockUser = useCallback(async () => {
    if (!vote?.post.userId) return;
    try {
      if (
        confirm(
          '해당 유저의 게시물이 목록에 노출되지 않으며, 다시 해제하실 수 없습니다.'
        )
      ) {
        await PostBlockUser(vote.post.userId);
        alert('유저를 차단하였습니다');
      }
    } catch (err) {
      console.log('유저 차단에 실패하였습니다.', err);
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
  }, [vote]);

  const startChat = useCallback(async () => {
    if (!vote?.post.userId) return;
    try {
      await openOrCreateChatRoom(vote.post.title, vote.post.userId, vote.post._id);
    } catch (error) {
      console.log('채팅방 생성에 실패하였습니다.', error);
    }
  }, [vote]);

  const deletePost = useCallback(async () => {
    if (!vote) return;
    try {
      if (confirm('정말로 게시물을 삭제하시겠습니까?')) {
        await DeletePost(vote.post._id);
        alert('게시물이 삭제되었습니다.');
      }
    } catch (error: unknown) {
      console.log('게시물 삭제에 실패하였습니다.', error);
      const message =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        (error.response as { data?: { message?: string } }).data?.message;
      alert(message);
    }
  }, [vote]);

  return {
    voteId: voteId?.toString() ?? '',
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
  };
}
