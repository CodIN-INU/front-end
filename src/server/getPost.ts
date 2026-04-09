/**
 * 서버에서 게시글 단건 조회 (SSR용)
 */

import type { Post } from '@/types/post';
import { serverFetch } from './serverFetch';

interface PostApiResponse {
  success: boolean;
  data?: { post: Post };
  message?: string;
}

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const res = await serverFetch<PostApiResponse>(`/posts/${postId}`);
    if (res.success && res.data?.post) {
      return res.data.post;
    }
    return null;
  } catch {
    return null;
  }
}
