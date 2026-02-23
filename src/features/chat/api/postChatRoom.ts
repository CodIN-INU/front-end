import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '@/features/auth/api/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostChatRoom = async (
  roomName: string,
  receiverId: string,
  referenceId: string,
  retryCount = 0
): Promise<AxiosResponse> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.post(`${apiUrl}/chatroom`, {
      roomName,
      receiverId,
      referenceId,
    });
    return response;
  } catch (error: unknown) {
    const err = error as {
      response?: { status: number; data?: { code?: number; message?: string } };
    };
    if (err.response) {
      const { status, data } = err.response;
      if (status === 401 && retryCount < 2) {
        try {
          await PostReissue();
          return await PostChatRoom(roomName, receiverId, referenceId, retryCount + 1);
        } catch {
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      } else if (data?.code === 403 && data?.message) {
        const id = data.message.split('/')[1];
        if (typeof window !== 'undefined') window.location.href = `/chatRoom/${id}`;
      }
    }
    throw error;
  }
};

export const startChat = async (
  title: string,
  userId: string,
  referenceId: string,
  retryCount = 0
): Promise<void> => {
  try {
    const response = await PostChatRoom(title, userId, referenceId);
    if (response?.data?.data?.chatRoomId && typeof window !== 'undefined') {
      window.location.href = '/chat';
    } else {
      throw new Error('Chat room ID is missing in the response.');
    }
  } catch (error: unknown) {
    const err = error as {
      response?: { status: number; data?: { code?: number; message?: string } };
    };
    if (err.response) {
      const { status, data } = err.response;
      if (status === 401 && retryCount < 2) {
        try {
          await PostReissue();
          return await startChat(title, userId, referenceId, retryCount + 1);
        } catch {
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      } else if (data?.code === 403 && data?.message) {
        const id = data.message.split('/')[1];
        if (typeof window !== 'undefined') window.location.href = `/chatRoom/${id}`;
      }
    }
    throw error;
  }
};
