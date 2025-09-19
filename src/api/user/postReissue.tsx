import axios, { AxiosResponse } from 'axios';
import { redirect } from 'next/dist/server/api-utils';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostReissue = async (): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    let response: AxiosResponse<any>;

    if (process.env.NEXT_PUBLIC_ENV === 'dev') {
      return response;
    } else {
      response = await axios.post(`${apiUrl}/auth/reissue`, {
        headers: {
          //Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
    }

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
