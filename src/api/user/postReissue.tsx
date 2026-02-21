import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function setTokenStorage(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('x-access-token');
  localStorage.setItem('accessToken', token);
  localStorage.setItem('x-access-token', token);
  document.cookie = `x-access-token=${token}; path=/; max-age=3600; SameSite=Lax`;
}

export const PostReissue = async (): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${apiUrl}/auth/reissue`,
      {},
      { withCredentials: true }
    );

    const token =
      response.headers['authorization']?.split(' ')[1] ??
      response.data?.accessToken ??
      response.data?.token;
    if (token) setTokenStorage(token);

    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error('Error response:', status, data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    // 401 Unauthorized 처리 -> 로그인 페이지로 리다이렉트
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
