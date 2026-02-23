import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetVoteDetail = async (
  postId: string | string[],
  retryCount = 0
): Promise<{ data: unknown }> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.get(`${apiUrl}/posts/${postId}`);
    return { data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await GetVoteDetail(postId, retryCount + 1);
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    throw error;
  }
};
