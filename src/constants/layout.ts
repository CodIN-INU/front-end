/**
 * 레이아웃 관련 상수
 * @see docs/APP_STRUCTURE.md
 */

/** DefaultBody 상단 패딩: fixed 헤더 높이에 맞춘 값 */
export const HEADER_PADDING = {
  /** 헤더 없음 (로그인 등) */
  NONE: 'none',
  /** 일반 헤더 (뒤로가기+타이틀, 80px) */
  COMPACT: 'compact',
  /** MainHeader+TopNav (로고+탭, 160px) */
  FULL: 'full',
} as const;

export type HeaderPaddingType =
  (typeof HEADER_PADDING)[keyof typeof HEADER_PADDING];
