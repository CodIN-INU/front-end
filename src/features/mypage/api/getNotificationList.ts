import apiClient from '@/shared/api/apiClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface GetNotificationListResponse {
  success: boolean;
  code: number;
  message: string;
  dataList: Notification[];
}

export const GetNotificationList =
  async (): Promise<GetNotificationListResponse> => {
    const { data } = await apiClient.get<GetNotificationListResponse>(
      '/notification'
    );
    return data;
  };
