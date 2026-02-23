import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const DeletePost = async (
  postId: string,
  retryCount = 0
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<unknown> = await axios.delete(
      `${apiUrl}/posts/${postId}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number }; request?: unknown; message?: string };
    if (err.response) {
      const { status } = err.response;
      if (status === 401 && retryCount < 2) {
        try {
          await PostReissue();
          return await DeletePost(postId, retryCount + 1);
        } catch {
          // 토큰 재발급 실패
        }
      }
    }
    throw error;
  }
};
