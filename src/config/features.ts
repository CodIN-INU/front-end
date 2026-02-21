/**
 * 기능 플래그 - 비활성화 시 UI에서 숨기고, 해당 라우트 접근 시 /main으로 리다이렉트
 * 재활성화 시 true로 변경만 하면 됨
 */
export const FEATURES = {
  /** 정보대 소개 (학과 사무실, 제휴사, 교수, 전화번호 등) */
  DEPARTMENT_INFO: false,
  /** 교과목 검색 및 추천, 강의 리뷰 */
  COURSES: false,
  /** 비교과 게시판 */
  EXTRACURRICULAR: false,
  /** 간식나눔 티켓팅 */
  TICKETING: false,
} as const;

/** 비활성화된 경로 접두사 (middleware 리다이렉트용) */
export const DISABLED_ROUTE_PREFIXES = [
  '/info/department-info',
  '/info/courses',
  '/info/course-reviews',
  '/boards/extracurricular',
] as const;

export function isRouteDisabled(pathname: string): boolean {
  return DISABLED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}
