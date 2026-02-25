const SEC_PER_MIN = 60;
const SEC_PER_HOUR = 3600;
const SEC_PER_DAY = 86400;
const SEC_PER_MONTH = SEC_PER_DAY * 30;
const SEC_PER_YEAR = SEC_PER_DAY * 365;

/**
 * 상대 시간 표시 (예: "3분 전", "2시간 전", "3달 전", "2년 전")
 */
export function timeAgo(timestamp: string): string {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  if (diff < SEC_PER_MIN) return '방금 전';
  if (diff < SEC_PER_HOUR) return `${Math.floor(diff / SEC_PER_MIN)}분 전`;
  if (diff < SEC_PER_DAY) return `${Math.floor(diff / SEC_PER_HOUR)}시간 전`;
  if (diff < SEC_PER_MONTH) return `${Math.floor(diff / SEC_PER_DAY)}일 전`;
  if (diff < SEC_PER_YEAR) return `${Math.floor(diff / SEC_PER_MONTH)}개월 전`;
  return `${Math.floor(diff / SEC_PER_YEAR)}년 전`;
}
