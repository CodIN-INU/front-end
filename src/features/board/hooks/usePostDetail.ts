'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post } from '@/types/post';
import apiClient from '@/api/clients/apiClient';
import { fetchPostById } from '../api/fetchPostById';

interface UsePostDetailOptions {
  postId: string;
  initialPost?: Post | null;
}

export function usePostDetail({ postId, initialPost }: UsePostDetailOptions) {
  const [post, setPost] = useState<Post | null>(initialPost ?? null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasInitial = initialPost && initialPost._id === postId;
    if (hasInitial) {
      setPost(initialPost);
      setError(null);
      setLoading(false);
      return;
    }

    setPost(null);
    setError(null);
    setLoading(true);

    fetchPostById(postId)
      .then(setPost)
      .catch((err) => {
        console.error('API 호출 오류:', err);
        setError(
          err instanceof Error ? err.message : 'API 호출 중 오류가 발생했습니다.'
        );
      })
      .finally(() => setLoading(false));
  }, [postId, initialPost]);

  const toggleLike = useCallback(async () => {
    if (!post) return;
    try {
      const response = await apiClient.post('/likes', {
        likeType: 'POST',
        likeTypeId: post._id,
      });
      if (response.data.success) {
        setPost({
          ...post,
          userInfo: { ...post.userInfo, like: !post.userInfo.like },
          likeCount: post.userInfo.like ? post.likeCount - 1 : post.likeCount + 1,
        });
      } else {
        console.error(response.data.message || '좋아요 실패');
      }
    } catch (err) {
      console.error('좋아요 토글 실패', err);
    }
  }, [post]);

  const toggleBookmark = useCallback(async () => {
    if (!post) return;
    try {
      const response = await apiClient.post(`/scraps/${postId}`);
      if (response.data.success) {
        setPost({
          ...post,
          userInfo: { ...post.userInfo, scrap: !post.userInfo.scrap },
          scrapCount: post.userInfo.scrap
            ? post.scrapCount - 1
            : post.scrapCount + 1,
        });
      } else {
        console.error(response.data.message || '북마크 실패');
      }
    } catch (err) {
      console.error('북마크 토글 실패', err);
    }
  }, [post, postId]);

  return {
    post,
    loading,
    error,
    toggleLike,
    toggleBookmark,
  };
}
