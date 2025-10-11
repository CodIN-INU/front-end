'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/userStore';

export default function AuthBootstrap() {
  const { hasHydrated, user, status, fetchMe } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;
    // 저장된 user가 없거나, 상태가 idle이면 서버에서 최신 사용자 정보 가져오기
    if (!user || status === 'idle') {
      fetchMe();
    }
  }, [hasHydrated, user, status, fetchMe]);

  return null;
}
