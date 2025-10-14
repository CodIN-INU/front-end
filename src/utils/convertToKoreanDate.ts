// utils/convertToKoreanDate.ts
export function convertToKoreanDate(dateStr: string): string {
  if (!dateStr) return '';
  const map: Record<string, string> = {
    Mon: '월', Tue: '화', Wed: '수', Thu: '목', Fri: '금', Sat: '토', Sun: '일',
  };
  return dateStr.replace(/\((Mon|Tue|Wed|Thu|Fri|Sat|Sun)\)/, (_, eng) => `(${map[eng]})`);
}
