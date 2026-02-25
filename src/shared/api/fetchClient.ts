import { PostReissue } from '@/features/auth/api/postReissue';

export interface FetchOptions extends RequestInit {
  /** 재시도 시 reissue 제외 플래그 (내부용) */
  _retry?: boolean;
  /** true면 401/403 시 reissue 시도 안 함. 로그인 페이지 세션 확인 등에 사용 */
  skipReissue?: boolean;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchClient<Response = unknown>(
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

  const { _retry, ...fetchInit } = options;
  let response = await fetch(url, fetchInit);

  if (response.status === 401 || (response.status === 403 && !init?._retry)) {
    try {
      await PostReissue();
      response = await fetch(url, fetchInit);
    } catch (err) {
      throw err;
    }
  }

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!response.ok) {
    let errorData: { message?: string; code?: number } = {};
    try {
      errorData = text ? JSON.parse(text) : {};
    } catch {
      errorData = { message: text || 'Unknown error' };
    }
    throw {
      status: response.status,
      message: errorData.message || '요청 실패',
      code: errorData.code ?? null,
    };
  }

  if (!text.trim()) return null as Response;

  if (contentType.includes('application/json')) {
    return JSON.parse(text) as Response;
  }
  return text as unknown as Response;
}
