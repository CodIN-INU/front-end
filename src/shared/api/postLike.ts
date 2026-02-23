import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostLike = async (
  likeType: string,
  likeTypeId: string,
  retryCount = 0
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.post(`${apiUrl}/likes`, {
      likeType,
      likeTypeId,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await PostLike(likeType, likeTypeId, retryCount + 1);
      } catch {
        // 토큰 재발급 실패
      }
    }
    throw error;
  }
};
