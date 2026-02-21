// named export 권장
export function convertToKoreanDate(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';

  // 영/한 요일 모두 커버
  const map: Record<string, string> = {
    Mon: '월', Tue: '화', Wed: '수', Thu: '목', Fri: '금', Sat: '토', Sun: '일',
    월: '월', 화: '화', 수: '수', 목: '목', 금: '금', 토: '토', 일: '일',
  };

  return input.replace(
    /\((Mon|Tue|Wed|Thu|Fri|Sat|Sun|월|화|수|목|금|토|일)\)/,
    (_, w) => `(${map[w] ?? w})`
  );
}
