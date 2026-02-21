/**
 * 서버에서 카테고리별 게시글 목록 조회 (SSR용)
 */

import type { Post } from '@/types/post';
import { serverFetch } from './serverFetch';

interface PostListItem {
  post: Post;
}

interface PostsCategoryApiResponse {
  success: boolean;
  data?: {
    contents: PostListItem[];
    nextPage: number;
  };
  message?: string;
}

export interface GetPostsByCategoryResult {
  posts: Post[];
  nextPage: number;
}

export async function getPostsByCategory(
  postCategory: string,
  page: number = 0
): Promise<GetPostsByCategoryResult> {
  try {
    const res = await serverFetch<PostsCategoryApiResponse>(
      `/posts/category?postCategory=${encodeURIComponent(postCategory)}&page=${page}`
    );
    if (!res.success || !res.data) {
      return { posts: [], nextPage: -1 };
    }
    const posts = Array.isArray(res.data.contents)
      ? res.data.contents.map((item: PostListItem) => item.post)
      : [];
    return {
      posts,
      nextPage: res.data.nextPage ?? -1,
    };
  } catch {
    return { posts: [], nextPage: -1 };
  }
}
