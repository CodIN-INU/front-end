import apiClient from '@/shared/api/apiClient';
import type { Post, PostApiItem } from '@/types/post';

interface FetchSearchPostsParams {
  keyword: string;
  page: number;
}

interface FetchSearchPostsResult {
  contents: Post[];
  nextPage: number;
}

export async function fetchSearchPosts({
  keyword,
  page,
}: FetchSearchPostsParams): Promise<FetchSearchPostsResult> {
  const response = await apiClient.get('/posts/search', {
    params: { keyword, pageNumber: page },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || '검색 데이터 로드 실패');
  }

  const data = response.data.data;
  const rawContents: unknown = data?.contents;
  const apiItems: PostApiItem[] = Array.isArray(rawContents)
    ? (rawContents as PostApiItem[])
    : [];

  const contents: Post[] = apiItems
    .filter((item) => !!item && typeof item === 'object' && 'post' in item)
    .map((item) => ({
      ...(item.post as Post),
      poll: item.poll ?? null,
    }));
  const nextPage = data?.nextPage ?? -1;

  return { contents, nextPage };
}
