/**
 * 서버에서 랭킹 게시글 조회 (메인 페이지 SSR용)
 */

import { serverFetch } from './serverFetch';

export interface RankingPost {
  _id: string;
  title: string;
  content: string;
  postCategory: string;
  hits?: number;
  likeCount?: number;
  commentCount?: number;
  anonymous?: boolean;
  nickname?: string;
  createdAt: string;
}

interface TopPostsApiResponse {
  success?: boolean;
  dataList?: RankingPost[];
  data?: { dataList?: RankingPost[] };
}

export async function getTopPosts(): Promise<RankingPost[]> {
  try {
    const res = await serverFetch<TopPostsApiResponse>('/posts/top3');
    const list = res.dataList ?? res.data?.dataList ?? [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
