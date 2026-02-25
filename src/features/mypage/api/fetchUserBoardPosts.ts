import apiClient from '@/shared/api/apiClient';
import type { Post, PostApiItem } from '@/types/post';

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

/** API 응답 한 건 { post, poll } → 평탄화된 Post */
function normalizePostItem(item: PostApiItem): Post {
  return {
    ...item.post,
    poll: item.poll ?? null,
  };
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
  const rawContents = Array.isArray(data?.contents) ? data.contents : [];
  const contents = rawContents.map((item: PostApiItem) =>
    normalizePostItem(item)
  );
  const nextPage = data?.nextPage ?? -1;

  return { contents, nextPage };
}
