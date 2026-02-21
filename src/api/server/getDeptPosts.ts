/**
 * 서버에서 학과 게시판 목록 조회 (공지/FAQ/의견 SSR용)
 */

import { serverFetch } from './serverFetch';
import type { NoticeData } from '@/features/dept-boards/types';

interface DeptNoticeApiResponse {
  success?: boolean;
  data?: {
    contents?: NoticeData[];
    lastPage?: number;
    nextPage?: number;
  };
  contents?: NoticeData[];
  nextPage?: number;
}

export interface GetDeptNoticeResult {
  notices: NoticeData[];
  nextPage: number;
}

/** 학과 공지 목록: /notice/category */
export async function getDeptNotices(
  department: string,
  page: number = 0
): Promise<GetDeptNoticeResult> {
  try {
    const res = await serverFetch<DeptNoticeApiResponse>(
      `/notice/category?department=${encodeURIComponent(department)}&page=${page}`
    );
    const contents = res.data?.contents ?? res.contents ?? [];
    const nextPage = res.data?.nextPage ?? res.nextPage ?? -1;
    return {
      notices: Array.isArray(contents) ? contents : [],
      nextPage,
    };
  } catch {
    return { notices: [], nextPage: -1 };
  }
}

/** 학과 FAQ 목록: /question */
export async function getDeptFaqs(
  department: string
): Promise<import('@/features/dept-boards/types').Faq[]> {
  try {
    const res = await serverFetch<{ dataList?: any[] }>(
      `/question?department=${encodeURIComponent(department)}`
    );
    const list = res.dataList ?? [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

interface VoiceBoxApiResponse {
  success?: boolean;
  data?: {
    contents?: any[];
    lastPage?: number;
    nextPage?: number;
  };
}

/** 학과 의견(voice-box) 목록 */
export async function getDeptOpinions(
  department: string,
  page: number = 0
): Promise<{ contents: any[]; nextPage: number }> {
  try {
    const res = await serverFetch<VoiceBoxApiResponse>(
      `/voice-box?department=${encodeURIComponent(department)}&page=${page}`
    );
    const contents = res.data?.contents ?? [];
    const nextPage = res.data?.nextPage ?? -1;
    return {
      contents: Array.isArray(contents) ? contents : [],
      nextPage,
    };
  } catch {
    return { contents: [], nextPage: -1 };
  }
}
