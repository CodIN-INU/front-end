import apiClient from '@/shared/api/apiClient';
import type { Post } from '@/types/post';

interface FetchPostsByCategoryParams {
  postCategory: string;
  page: number;
}

interface FetchPostsByCategoryResult {
  contents: Post[];
  nextPage: number;
}

export async function fetchPostsByCategory({
  postCategory,
  page,
}: FetchPostsByCategoryParams): Promise<FetchPostsByCategoryResult> {
  const response = await apiClient.get('/posts/category', {
    params: { postCategory, page },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || '데이터 로드 실패');
  }

  const data = response.data.data;
  const contents = Array.isArray(data?.contents)
    ? data.contents.map((item: { post?: Post }) => item.post).filter(Boolean)
    : [];
  const nextPage = data?.nextPage ?? -1;

  return { contents, nextPage };
}
