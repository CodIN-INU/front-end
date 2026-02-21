/**
 * 서버에서 강의 목록 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';
import type { Course } from '@/types/course';

interface CoursesApiResponse {
  success?: boolean;
  data?: {
    contents?: Course[];
    nextPage?: number;
  };
}

export interface GetCoursesResult {
  courses: Course[];
  nextPage: number;
}

export async function getCourses(
  page: number = 0,
  options?: {
    department?: string;
    sort?: string;
    keyword?: string;
    like?: boolean;
  }
): Promise<GetCoursesResult> {
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (options?.keyword) params.set('keyword', options.keyword);
    if (options?.department && options.department !== 'ALL')
      params.set('department', options.department);
    if (options?.sort && options.sort !== 'ALL') params.set('sort', options.sort);
    if (options?.like) params.set('like', 'true');

    const res = await serverFetch<CoursesApiResponse>(
      `/lectures/courses?${params.toString()}`
    );
    const contents = res.data?.contents ?? [];
    const nextPage = res.data?.nextPage ?? -1;
    return {
      courses: Array.isArray(contents) ? contents : [],
      nextPage,
    };
  } catch {
    return { courses: [], nextPage: -1 };
  }
}
