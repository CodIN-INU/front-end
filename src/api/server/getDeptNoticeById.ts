/**
 * 서버에서 학과 공지/질문 상세 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';

export interface DeptNoticePost {
  _id: string;
  userId: string;
  postCategory: string;
  title: string;
  content: string;
  nickname: string;
  userImageUrl?: string;
  postImageUrl?: string[] | null;
  scrapCount?: number;
  hits?: number;
  createdAt: string;
  userInfo?: { scrap: boolean; mine: boolean };
  anonymous?: boolean;
}

interface NoticeDetailApiResponse {
  success?: boolean;
  data?: DeptNoticePost;
}

export async function getDeptNoticeById(
  id: string | string[]
): Promise<DeptNoticePost | null> {
  const noticeId = Array.isArray(id) ? id[0] : String(id ?? '');
  if (!noticeId) return null;
  try {
    const res = await serverFetch<NoticeDetailApiResponse>(`/notice/${noticeId}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}
