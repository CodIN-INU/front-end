'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import type { SnackEvent, FetchSnackResponse } from '@/types/snackEvent';

interface InitialData {
  initialEvents: SnackEvent[];
  initialNextPage: number;
}

/**
 * 캠퍼스별 티켓팅 이벤트 목록 + 무한 스크롤
 */
export function useTicketingEventList(
  postCategory: string,
  initialData?: InitialData
) {
  const [snacks, setSnacks] = useState<SnackEvent[]>(
    initialData?.initialEvents ?? []
  );
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(!(initialData?.initialEvents?.length));
  const [hasMore, setHasMore] = useState(
    initialData ? initialData.initialNextPage >= 0 : true
  );
  const isFetching = useRef(false);

  const fetchPosts = useCallback(
    async (pageNumber: number) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setIsLoading(true);
      try {
        const response = await fetchClient<FetchSnackResponse>(
          `/ticketing/event?campus=${postCategory}&page=${pageNumber}`
        );
        const eventList = response?.data?.eventList;
        if (!Array.isArray(eventList)) {
          console.error('eventList 형식 오류:', eventList);
          setHasMore(false);
          return;
        }
        if (eventList.length === 0) {
          setHasMore(false);
        } else {
          setSnacks(prev => [...prev, ...eventList]);
        }
      } catch (e) {
        console.error('이벤트 목록 조회 실패.', e);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [postCategory]
  );

  // 탭 변경 시 초기화 후 첫 페이지 로드
  useEffect(() => {
    if (!postCategory) return;
    if (initialData?.initialEvents?.length) {
      setSnacks(initialData.initialEvents);
      setHasMore(initialData.initialNextPage >= 0);
      setPage(0);
      setIsLoading(false);
      return;
    }
    setSnacks([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0);
  }, [postCategory, fetchPosts]);

  // page > 0 일 때 추가 로드
  useEffect(() => {
    if (page > 0 && postCategory) {
      fetchPosts(page);
    }
  }, [page, postCategory, fetchPosts]);

  const fetchNextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  return { snacks, isLoading, hasMore, fetchNextPage };
}
