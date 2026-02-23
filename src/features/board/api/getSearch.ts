import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetSearch = async (
  keyword: string,
  pageNumber: number,
  retryCount = 0
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<unknown> = await axios.get(
      `${apiUrl}/posts/search?keyword=${keyword}&pageNumber=${pageNumber}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await GetSearch(keyword, pageNumber, retryCount + 1);
      } catch {
        // 토큰 재발급 실패
      }
    }
    throw error;
  }
};
