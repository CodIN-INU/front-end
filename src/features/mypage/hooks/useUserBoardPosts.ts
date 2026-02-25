'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post } from '@/types/post';
import type { UserBoardType } from '../api/fetchUserBoardPosts';
import { fetchUserBoardPosts } from '../api/fetchUserBoardPosts';
import { useInfiniteScroll } from '@/features/board/hooks/useInfiniteScroll';

const HEADER_TITLE_MAP: Record<UserBoardType, string> = {
  posts: '내가 작성한 글',
  likes: '좋아요 한 글',
  comments: '댓글을 작성한 글',
  scraps: '스크랩 한 글',
};

export function useUserBoardPosts(boardType: UserBoardType | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      if (!boardType) return;

      setIsLoading(true);
      try {
        const { contents, nextPage } = await fetchUserBoardPosts(
          boardType,
          pageNumber
        );
        setPosts((prev) =>
          pageNumber === 0 ? contents : [...prev, ...contents]
        );
        setHasMore(nextPage !== -1);
      } catch (error) {
        console.error('마이페이지 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [boardType]
  );

  useEffect(() => {
    if (!boardType) return;

    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPage(0);
  }, [boardType]);

  useEffect(() => {
    if (page > 0) fetchPage(page);
  }, [page]);

  const loadNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: loadNextPage,
  });

  const headerTitle = boardType ? HEADER_TITLE_MAP[boardType] : '마이페이지';

  return {
    posts,
    isLoading,
    hasMore,
    headerTitle,
  };
}
