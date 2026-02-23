import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function onLoginSuccess() {
  if (typeof window !== 'undefined' && (window as { ReactNativeWebView?: { postMessage: (msg: string) => void } }).ReactNativeWebView) {
    (window as { ReactNativeWebView: { postMessage: (msg: string) => void } }).ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'LOGIN_SUCCESS' })
    );
  }
}

export const PostLogin = async (
  studentId: string,
  password: string
): Promise<AxiosResponse> => {
  axios.defaults.withCredentials = true;

  try {
  const response: AxiosResponse = await axios.post(
    `${apiUrl}/auth/login`,
    { email: studentId, password },
    { withCredentials: true }
  );

  const token =
    (response.headers as Record<string, string>)['authorization']?.split(' ')[1] ??
    (response.data as { accessToken?: string; token?: string })?.accessToken ??
    (response.data as { accessToken?: string; token?: string })?.token;

  if (token && typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('x-access-token');
    localStorage.setItem('accessToken', token);
    localStorage.setItem('x-access-token', token);
    document.cookie = `x-access-token=${token}; path=/; max-age=3600; SameSite=Lax`;
  }

  onLoginSuccess();
  return response;
  } catch (error) {
    throw error;
  }
};
