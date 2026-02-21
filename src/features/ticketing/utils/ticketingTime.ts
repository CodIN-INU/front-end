/**
 * 티켓팅 이벤트 시간 파싱 유틸
 */

/** 서버 타임스탬프(나노초 포함 가능) 파싱 */
export function parseServerTimestamp(ts: string): number | null {
  if (!ts) return null;
  const firstTry = Date.parse(ts);
  if (!Number.isNaN(firstTry)) return firstTry;
  try {
    const [iso, frac] = ts.split('.');
    const ms = (frac ?? '').slice(0, 3).padEnd(3, '0');
    const fixed = `${iso}.${ms}Z`;
    const parsed = Date.parse(fixed);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

/** "2025.10.15 (Wed) 12:00" 형태 문자열을 로컬 시간(ms)으로 파싱 */
export function parseBackendLocalMs(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s*\([^)]+\)\s*/g, ' ').trim();
  const m = cleaned.match(
    /^(\d{4})[.\-](\d{2})[.\-](\d{2})\s+(\d{2}):(\d{2})$/
  );
  if (m) {
    const [, y, mo, d, hh, mm] = m.map(Number);
    const dt = new Date(y, mo - 1, d, hh, mm, 0, 0);
    return dt.getTime();
  }
  const fallback = Date.parse(cleaned);
  return Number.isNaN(fallback) ? null : fallback;
}

const DAY_MS = 86_400_000;

/** 두 시각 사이 남은 캘린더 일수 */
export function calendarDaysLeft(fromMs: number, toMs: number): number {
  const from = new Date(fromMs);
  const to = new Date(toMs);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  const d = Math.ceil((to.getTime() - from.getTime()) / DAY_MS);
  return Math.max(d, 0);
}

export { DAY_MS };
