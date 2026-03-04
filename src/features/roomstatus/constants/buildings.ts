/**
 * 강의실 현황용 건물(호관) / 층 옵션
 * API: /lectures/rooms/empty/detail?building=7&floor=0 (floor 0 = 전체)
 */

/** 강의 현황이 존재하는 건물 호관 */
export const ROOM_BUILDING_OPTIONS = [
  { value: '4', label: '정보전산원(BM컨텐츠관)' },
  { value: '5', label: '자연과학대학, 생명과학기술대학' },
  { value: '7', label: '정보기술대학' },
  { value: '8', label: '공과대학, 도시과학대학' },
  { value: '9', label: '공동실험실습관' },
  { value: '11', label: '복지회관(학생식당)' },
  { value: '12', label: '컨벤션센터' },
  { value: '13', label: '사회과학대학, 법학부, 글로벌정경대학' },
  { value: '14', label: '경영대학, 동북아물류대학원, 동북아국제통상물류학부' },
  { value: '15', label: '인문대학' },
  { value: '16', label: '예술체육대학' },
  { value: '19', label: '융합자유전공대학' },
  { value: '20', label: '스포츠센터, 골프연습장' },
  { value: '23', label: '강당·공연장' },
  { value: '27', label: '제2공동실습관' },
  { value: '28', label: '도시과학대학' },
  { value: '29', label: '생명공학부' },
  { value: '41', label: '바이오컴플렉스' },
] as const;

export const ROOM_FLOOR_OPTIONS = [
  { value: '1', label: '1층' },
  { value: '2', label: '2층' },
  { value: '3', label: '3층' },
  { value: '4', label: '4층' },
  { value: '5', label: '5층' },
] as const;

export const DEFAULT_BUILDING = '7';
export const DEFAULT_FLOOR = '1';
