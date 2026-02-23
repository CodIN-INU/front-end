// 목록/검색
import type { searchTypesType } from './types';

export const DEPARTMENTS = [
  { label: '컴공', value: 'COMPUTER_SCI' },
  { label: '정통', value: 'INFO_COMM' },
  { label: '임베', value: 'EMBEDDED' },
  { label: '공통', value: 'OTHERS' },
];

export const SEARCHTYPES: searchTypesType[] = [
  { label: '과목명', value: 'LEC' },
  { label: '교수명', value: 'PROF' },
];

// write-review
export const DEPARTMENT = [
  { label: '컴공', value: 'COMPUTER_SCI' },
  { label: '정통', value: 'INFO_COMM' },
  { label: '임베', value: 'EMBEDDED' },
  { label: '공통', value: 'OTHERS' },
];

export const GRADE = [
  { label: '1학년', value: '1' },
  { label: '2학년', value: '2' },
  { label: '3학년', value: '3' },
  { label: '4학년', value: '4' },
];

export const SEMESTER = [
  { label: '23 - 1', value: '23-1' },
  { label: '23 - 2', value: '23-2' },
  { label: '24 - 1', value: '24-1' },
  { label: '24 - 2', value: '24-2' },
  { label: '25 - 1', value: '25-1' },
];

export const ALERTMESSAGE =
  '작성 중이던 리뷰는 모두 지워져요.\n템플릿을 적용할까요?';
export const TEMPLATETEXT =
  '강의와 교재는? : \n과제는? : \n시험은? : \n조별 과제는? : \n\n\n나만의 꿀팁 : ';
