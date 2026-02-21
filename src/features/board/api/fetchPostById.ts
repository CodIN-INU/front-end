import apiClient from '@/api/clients/apiClient';
import type { Post } from '@/types/post';

interface PostApiResponse {
  success: boolean;
  data?: { post: Post };
  message?: string;
}

export async function fetchPostById(postId: string): Promise<Post> {
  const response = await apiClient.get<PostApiResponse>(`/posts/${postId}`);

  if (!response.data.success || !response.data.data?.post) {
    throw new Error(response.data.message || '게시물 로드 실패');
  }

  return response.data.data.post;
}
