import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostChatImage = async (
  chatImages: File,
  retryCount = 0
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const formData = new FormData();
    formData.append('chatImages', chatImages);
    const response = await axios.post(`${apiUrl}/chats/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401 && retryCount < 2) {
      try {
        await PostReissue();
        return await PostChatImage(chatImages, retryCount + 1);
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    throw error;
  }
};
