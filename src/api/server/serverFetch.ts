/**
 * 서버 컴포넌트 전용 API 호출 유틸.
 * next/headers cookies() 사용 → 클라이언트 번들에 포함되지 않음.
 */

import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT_MS = 10_000; // 10초 - LCP 블로킹 방지

if (!apiUrl) {
  console.warn('[serverFetch] NEXT_PUBLIC_API_URL is not set');
}

export interface ServerFetchOptions extends RequestInit {
  _retry?: boolean;
}

/**
 * 서버에서 백엔드 API 호출 (쿠키 자동 전달)
 * 타임아웃으로 장시간 블로킹 방지
 */
export async function serverFetch<T = unknown>(
  path: string,
  init?: ServerFetchOptions
): Promise<T> {
  const url = `${apiUrl}${path}`;
  const cookieStore = await cookies();
  const token = cookieStore.get('x-access-token')?.value;
  const cookieHeader = cookieStore.toString();

  const headers: HeadersInit = {
    ...init?.headers,
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const useTimeout = !init?.signal;
  const controller = useTimeout ? new AbortController() : null;
  const timeoutId = useTimeout
    ? setTimeout(() => controller!.abort(), FETCH_TIMEOUT_MS)
    : null;

  const res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
    signal: init?.signal ?? controller?.signal,
  }).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`serverFetch ${path} ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
