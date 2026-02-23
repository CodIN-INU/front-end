import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetChatData = async (
  chatRoomId: string | string[],
  page: number,
  retryCount = 0
): Promise<AxiosResponse> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.get(
      `${apiUrl}/chats/list/${chatRoomId}?page=${page}`,
      { withCredentials: true }
    );
    return response;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await GetChatData(chatRoomId, page, retryCount + 1);
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    throw error;
  }
};
