// fetchClient.ts

import { PostReissue } from '../user/postReissue';
export interface FetchOptions extends RequestInit {
  _retry?: boolean;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchClient<Response = any>(
  path: string,
  init?: FetchOptions
): Promise<Response> {
  const url = `${apiUrl}${path}`;
  const options: FetchOptions = {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.headers || {}),
    },
  };

  console.log('[fetchClient] 요청 URL:', url);

  let response = await fetch(url, options);

  // 401 처리
  if (response.status === 401 || (response.status === 403 && !init?._retry)) {
    try {
      console.log('🔄 401 Unauthorized - 토큰 재발급 시도 중...');
      await PostReissue();

      const retryOptions: FetchOptions = {
        ...options,
        _retry: true,
      };

      response = await fetch(url, retryOptions);
    } catch (err) {
      console.error('❌ 토큰 재발급 실패', err);
      throw err;
    }
  }
  
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  
  if (!response.ok) {
    let errorData: any = {};

    try {
      // 서버에서 보낸 JSON 파싱
      errorData = text ? JSON.parse(text) : {};
    } catch {
      errorData = { message: text || 'Unknown error' };
    }

    // 에러 구조 표준화
    const errorPayload = {
      status: response.status,
      message: errorData.message || '요청 실패',
      code: errorData.code || null,
    };

    console.error('fetchClient 에러:', errorPayload);

    throw errorPayload;
  }

  
  if (!text.trim()) {
    // 바디가 비어 있으면 null 반환
    return null;
  }

  // JSON이면 파싱
  if (contentType.includes('application/json')) {
    const result = JSON.parse(text) as Response;
    return result;
  }

  // 그 외 타입(text/plain 등)은 그대로 반환
  return text as unknown as Response;
}
