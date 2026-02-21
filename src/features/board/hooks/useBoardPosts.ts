import { useState, useEffect, useRef, useCallback } from 'react';
import type { Post } from '@/types/post';
import type { Board } from '@/data/boardData';
import { fetchPostsByCategory } from '../api/fetchPostsByCategory';

interface UseBoardPostsOptions {
  boardName: string;
  board: Board;
  activeTab: string;
  initialPosts?: Post[];
  initialNextPage?: number;
  /** SSR로 전달된 boardName과 일치할 때만 initialData 사용 */
  isSSRBoard?: boolean;
}

export function useBoardPosts({
  boardName,
  board,
  activeTab,
  initialPosts = [],
  initialNextPage,
  isSSRBoard = false,
}: UseBoardPostsOptions) {
  const { tabs } = board;
  const defaultTab = tabs.length > 0 ? tabs[0].value : 'default';
  const activePostCategory = tabs.find((tab) => tab.value === activeTab)?.postCategory ?? '';

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialNextPage !== undefined ? initialNextPage !== -1 : true
  );
  const isFetching = useRef(false);

  const hasSSRData = isSSRBoard && initialPosts.length > 0 && activeTab === defaultTab;

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      if (isFetching.current || !activePostCategory) return;

      isFetching.current = true;
      setIsLoading(true);
      try {
        const { contents, nextPage } = await fetchPostsByCategory({
          postCategory: activePostCategory,
          page: pageNumber,
        });
        setPosts((prev) => (pageNumber === 0 ? contents : [...prev, ...contents]));
        setHasMore(nextPage !== -1);
      } catch (error) {
        console.error('게시물 로드 실패:', error);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [activePostCategory]
  );

  // 탭/게시판 변경 시 초기화 및 재조회
  useEffect(() => {
    if (hasSSRData) return;

    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPage(0);
  }, [boardName, activeTab]);

  // page 변경 시 추가 로드 (초기화 제외)
  useEffect(() => {
    if (page > 0) fetchPage(page);
  }, [page]);

  const loadNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  return {
    posts,
    setPosts,
    isLoading,
    hasMore,
    loadNextPage,
  };
}
