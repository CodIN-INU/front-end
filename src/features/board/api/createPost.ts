import apiClient from '@/api/clients/apiClient';

export interface CreatePostFormData {
  title: string;
  content: string;
  postCategory: string;
  anonymous: boolean;
}

export async function createPost(
  formData: CreatePostFormData,
  images: File[]
): Promise<{ postId: string }> {
  const data = new FormData();
  data.append('postContent', JSON.stringify(formData));
  images.forEach((file) => data.append('postImages', file));

  const response = await apiClient.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || `HTTP ${response.status}: 응답 없음`
    );
  }

  const postId = response.data?.data?.postId;
  if (!postId) throw new Error('postId가 반환되지 않았습니다.');

  return { postId };
}
