'use client';

import { useRefreshOnForeground } from '@/hooks/useRefreshOnForeground';

/**
 * 포그라운드 복귀 시 router.refresh()를 수행하는 클라이언트 래퍼.
 * 레이아웃에 한 번만 넣으면 앱 전역에서 동작합니다.
 */
export function RefreshOnForeground() {
  useRefreshOnForeground();
  return null;
}
