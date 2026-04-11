/**
 * `YYYY-MM-DD HH:MM:SS` (또는 초 생략 `HH:MM`) 문자열을 `MM/DD HH:MM` 형식으로 변환합니다.
 * 파싱에 실패하면 빈 문자열을 반환합니다.
 */
const DATETIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function formatShortDateTime(value: string): string {
  const match = value.trim().match(DATETIME_PATTERN);
  if (!match) return '';

  const [, , month, day, hour, minute] = match;
  return `${month}/${day} ${hour}:${minute}`;
}
