import apiClient from '@/shared/api/apiClient';
import type { Post } from '@/types/post';

export type UserBoardType = 'posts' | 'likes' | 'comments' | 'scraps';

const ENDPOINT_MAP: Record<UserBoardType, string> = {
  posts: '/users/post',
  likes: '/users/like',
  comments: '/users/comment',
  scraps: '/users/scrap',
};

export interface FetchUserBoardPostsResult {
  contents: Post[];
  nextPage: number;
}

export async function fetchUserBoardPosts(
  boardType: UserBoardType,
  page: number
): Promise<FetchUserBoardPostsResult> {
  const endpoint = ENDPOINT_MAP[boardType];
  const response = await apiClient.get(endpoint, {
    params: { page },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || '데이터 로드 실패');
  }

  const data = response.data.data;
  const contents = Array.isArray(data?.contents) ? data.contents : [];
  const nextPage = data?.nextPage ?? -1;

  return { contents, nextPage };
}
