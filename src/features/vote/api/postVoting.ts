import axios from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostVoting = async (
  postId: string,
  selectedOptions: number[],
  retryCount = 0
): Promise<void> => {
  axios.defaults.withCredentials = true;
  try {
    await axios.post(`${apiUrl}/polls/voting/${postId}`, {
      selectedOptions,
    });
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await PostVoting(postId, selectedOptions, retryCount + 1);
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    throw error;
  }
};
