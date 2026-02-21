'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Post } from '@/types/post';
import { fetchSearchPosts } from '../api/fetchSearchPosts';
import { useInfiniteScroll } from './useInfiniteScroll';

export function useSearchPosts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const isFetching = useRef(false);

  const fetchPage = useCallback(async (query: string, pageNumber: number) => {
    if (isFetching.current || !query.trim()) return;

    isFetching.current = true;
    setIsLoading(true);
    setIsSearching(true);

    try {
      const { contents, nextPage } = await fetchSearchPosts({
        keyword: query,
        page: pageNumber,
      });
      setPosts((prev) =>
        pageNumber === 0 ? contents : [...prev, ...contents]
      );
      setHasMore(nextPage !== -1);
    } catch (error) {
      console.error('검색 API 호출 오류:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  const handleSearch = useCallback(
    (e?: React.FormEvent | React.MouseEvent) => {
      e?.preventDefault();
      const q = searchQuery.trim();
      setPosts([]);
      setPage(0);
      setHasMore(true);
      setIsSearching(!!q);
      if (q) fetchPage(q, 0);
    },
    [searchQuery, fetchPage]
  );

  const loadNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: loadNextPage,
  });

  useEffect(() => {
    if (page > 0 && isSearching && searchQuery.trim())
      fetchPage(searchQuery, page);
  }, [page, isSearching, searchQuery, fetchPage]);

  return {
    searchQuery,
    setSearchQuery,
    posts,
    isLoading,
    hasMore,
    isSearching,
    handleSearch,
  };
}
