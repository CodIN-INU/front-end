import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetComments = async (
  postId: string | string[],
  retryCount = 0
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.get(
      `${apiUrl}/comments/post/${postId}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await GetComments(postId, retryCount + 1);
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    throw error;
  }
};
