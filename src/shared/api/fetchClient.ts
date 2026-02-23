import { PostReissue } from '@/features/auth/api/postReissue';

export interface FetchOptions extends RequestInit {
  _retry?: boolean;
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

  let response = await fetch(url, options);

  if (response.status === 401 || (response.status === 403 && !init?._retry)) {
    try {
      await PostReissue();
      response = await fetch(url, { ...options, _retry: true });
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
