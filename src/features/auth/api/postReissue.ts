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

export const PostReissue = async (): Promise<AxiosResponse> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.post(
      `${apiUrl}/auth/reissue`,
      {},
      { withCredentials: true }
    );

    const token =
      (response.headers as Record<string, string>)['authorization']?.split(' ')[1] ??
      (response.data as { accessToken?: string; token?: string })?.accessToken ??
      (response.data as { accessToken?: string; token?: string })?.token;
    if (token) setTokenStorage(token);

    return response;
  } catch (error) {
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
