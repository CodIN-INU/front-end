import apiClient from '@/api/clients/apiClient';
import type { Post } from '@/types/post';

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
  const contents = Array.isArray(data?.contents) ? data.contents : [];
  const nextPage = data?.nextPage ?? -1;

  return { contents, nextPage };
}
