import { useEffect } from 'react';

const SCROLL_THRESHOLD = 300;

interface UseInfiniteScrollOptions {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * 스크롤이 하단 근처에 도달하면 onLoadMore 호출
 */
export function useInfiniteScroll({
  isLoading,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;

      if (isNearBottom) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, onLoadMore]);
}
