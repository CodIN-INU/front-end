/**
 * 서버에서 강의 리뷰 관련 데이터 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';

/** 수강 후기 목록: /lectures/list (학과, 검색어, 정렬, 페이지) */
export interface CourseReviewListItem {
  lectureNm: string;
  _id: string;
  starRating: number;
  professor: string;
  participants: number;
  grade: number;
  semesters: string[];
}

interface CourseReviewListApiResponse {
  data?: {
    contents?: CourseReviewListItem[];
    nextPage?: number;
  };
}

export interface GetCourseReviewsResult {
  contents: CourseReviewListItem[];
  nextPage: number;
}

export async function getCourseReviews(
  department: string,
  page: number = 0,
  options?: { keyword?: string; option?: string }
): Promise<GetCourseReviewsResult> {
  try {
    const params = new URLSearchParams({
      department,
      page: String(page),
      keyword: options?.keyword ?? '',
      option: options?.option ?? 'LEC',
    });
    const res = await serverFetch<CourseReviewListApiResponse>(
      `/lectures/list?${params.toString()}`
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

/** 과목별 후기 상세(강의 정보+감정): /lectures/:lectureId */
export interface LectureRatingInfo {
  _id: string;
  lectureNm: string;
  professor: string;
  starRating: number;
  participants: number;
  grade: number;
  semesters: string[];
  emotion?: {
    hard: number;
    ok: number;
    best: number;
  };
}

export async function getLectureRatingInfo(
  lectureId: string | string[]
): Promise<LectureRatingInfo | null> {
  const id = Array.isArray(lectureId) ? lectureId[0] : String(lectureId ?? '');
  if (!id) return null;
  try {
    const res = await serverFetch<{ data?: LectureRatingInfo }>(
      `/lectures/${id}`
    );
    return res.data ?? null;
  } catch {
    return null;
  }
}

/** 과목별 후기 댓글 목록: /reviews/:lectureId */
export interface ReviewComment {
  _id: string;
  content: string;
  starRating: number;
  likeCount: number;
  liked: boolean;
  semester: string;
}

interface ReviewCommentsApiResponse {
  data?: {
    contents?: ReviewComment[];
    nextPage?: number;
  };
}

export async function getLectureReviews(
  lectureId: string | string[],
  page: number = 0
): Promise<{ contents: ReviewComment[]; nextPage: number }> {
  const id = Array.isArray(lectureId) ? lectureId[0] : String(lectureId ?? '');
  if (!id) return { contents: [], nextPage: -1 };
  try {
    const res = await serverFetch<ReviewCommentsApiResponse>(
      `/reviews/${id}?page=${page}`
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
