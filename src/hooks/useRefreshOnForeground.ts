'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * 웹뷰/탭이 포그라운드로 돌아올 때(visibilityState가 visible로 바뀔 때) Next.js 라우터 새로고침을 수행합니다.
 * 초기 마운트 시에는 새로고침하지 않고, 백그라운드 → 포그라운드 전환 시에만 동작합니다.
 */
export function useRefreshOnForeground(): void {
  const router = useRouter();
  const wasVisibleRef = useRef(
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!wasVisibleRef.current) {
          router.refresh();
        }
        wasVisibleRef.current = true;
      } else {
        wasVisibleRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [router]);
}
