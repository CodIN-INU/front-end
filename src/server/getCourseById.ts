/**
 * 서버에서 강의 상세 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';
import type { CourseDetail } from '@/types/course';

interface CourseDetailApiResponse {
  success?: boolean;
  data?: CourseDetail;
}

export async function getCourseById(
  id: string | string[]
): Promise<CourseDetail | null> {
  const courseId = Array.isArray(id) ? id[0] : String(id ?? '');
  if (!courseId) return null;
  try {
    const res = await serverFetch<CourseDetailApiResponse>(`/lectures/${courseId}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}
