import apiClient from '@/shared/api/apiClient';

export const PostSubscribe = async (): Promise<void> => {
  await apiClient.post('/fcm/subscribe');
};
