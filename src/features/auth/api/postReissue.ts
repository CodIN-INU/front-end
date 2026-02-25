import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const isRefreshDebug = () =>
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_REFRESH === 'true';

function setTokenStorage(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('x-access-token');
  localStorage.setItem('accessToken', token);
  localStorage.setItem('x-access-token', token);
  document.cookie = `x-access-token=${token}; path=/; max-age=3600; SameSite=Lax`;
}

export const PostReissue = async (): Promise<AxiosResponse> => {
  axios.defaults.withCredentials = true;
  if (isRefreshDebug()) {
    console.log('[Refresh] reissue 요청 시도', new Date().toISOString());
  }
  try {
    // 리프레시 토큰은 HttpOnly 쿠키로 설정되어 있음 → withCredentials로 자동 전송
    const response: AxiosResponse = await axios.post(
      `${apiUrl}/auth/reissue`,
      {},
      { withCredentials: true }
    );

    const token =
      (response.headers as Record<string, string>)['authorization']?.split(' ')[1] ??
      (response.data as { accessToken?: string; token?: string })?.accessToken ??
      (response.data as { accessToken?: string; token?: string })?.token;
    if (token) {
      setTokenStorage(token);
      if (isRefreshDebug()) {
        console.log('[Refresh] reissue 성공, 새 토큰 저장됨', new Date().toISOString());
      }
    } else if (isRefreshDebug()) {
      console.warn('[Refresh] reissue 200이지만 토큰 없음', response.data);
    }

    return response;
  } catch (error) {
    if (isRefreshDebug()) {
      console.error('[Refresh] reissue 실패', error);
    }
    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login'
    ) {
      window.location.href =
        '/login?next=' + encodeURIComponent(window.location.pathname);
    }
    throw error;
  }
};
