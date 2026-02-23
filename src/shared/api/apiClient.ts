import axios, { AxiosInstance } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function createAPIClient(): AxiosInstance {
  axios.defaults.withCredentials = true;
  const client = axios.create({ baseURL: apiUrl });

  client.interceptors.request.use(
    (config) => {
      const token =
        process.env.NEXT_PUBLIC_ENV === 'dev'
          ? localStorage.getItem('x-access-token')
          : getCookie('x-access-token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await PostReissue();
          const newToken =
            process.env.NEXT_PUBLIC_ENV === 'dev'
              ? localStorage.getItem('x-access-token')
              : getCookie('x-access-token');
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        } catch {
          // 토큰 재발급 실패
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

const apiClient = createAPIClient();
export default apiClient;
