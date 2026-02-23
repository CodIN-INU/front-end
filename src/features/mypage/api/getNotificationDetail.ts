import apiClient from '@/shared/api/apiClient';

export interface NotificationDetail {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface GetNotificationDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: NotificationDetail;
}

export const GetNotificationDetail = async (
  notificationId: string
): Promise<GetNotificationDetailResponse> => {
  const { data } = await apiClient.get<GetNotificationDetailResponse>(
    `/notification/${notificationId}`
  );
  return data;
};
