import axios from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostVote = async (
  title: string,
  content: string,
  pollOptions: string[],
  multipleChoice: boolean,
  pollEndTime: string,
  anonymous: boolean,
  retryCount = 0
): Promise<void> => {
  axios.defaults.withCredentials = true;
  try {
    await axios.post(`${apiUrl}/polls`, {
      title,
      content,
      pollOptions,
      multipleChoice,
      pollEndTime,
      anonymous,
      postCategory: 'POLL',
    });
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await PostVote(
          title,
          content,
          pollOptions,
          multipleChoice,
          pollEndTime,
          anonymous,
          retryCount + 1
        );
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    throw error;
  }
};
