// src/api/clients/apiClient.ts
import axios, { AxiosInstance } from 'axios';
import { PostReissue } from '../user/postReissue';

// 쿠키에서 특정 이름의 값을 읽어오는 함수
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function createAPIClient(): AxiosInstance {
  axios.defaults.withCredentials = true;
  const client = axios.create({
    baseURL: apiUrl,
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    config => {
      const token = process.env.NEXT_PUBLIC_ENV === 'dev' ? localStorage.getItem("accessToken") : getCookie('accessToken'); // 쿠키에서 accessToken 읽기
      if (token) {
        alert("토큰이 존재합니다. " + token);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 재시도 플래그 설정

        console.error(
          '401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.'
        );

        try {
          console.log('🔄 토큰 재발급 시도...');
          const res = await PostReissue(); // 토큰 재발급 요청
          console.log(res);

          // 토큰 재발급 성공 후, 원래 요청을 다시 시도
          const newToken = process.env.NEXT_PUBLIC_ENV === 'dev' ? localStorage.getItem("accessToken") : getCookie('accessToken');
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest); // 재요청
          }
        } catch (refreshError) {
          console.error('❌ 토큰 재발급 실패', refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

const apiClient = createAPIClient();
export default apiClient;
