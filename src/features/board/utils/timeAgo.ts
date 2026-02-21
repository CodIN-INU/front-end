/**
 * 상대 시간 표시 (예: "3분 전", "2시간 전")
 */
export function timeAgo(timestamp: string): string {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
