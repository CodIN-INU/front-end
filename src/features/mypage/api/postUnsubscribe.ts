import apiClient from '@/shared/api/apiClient';

export const PostUnsubscribe = async (): Promise<void> => {
  await apiClient.post('/fcm/unsubscribe');
};
