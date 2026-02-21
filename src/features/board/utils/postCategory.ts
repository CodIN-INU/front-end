/**
 * postCategory 관련 매핑 유틸 (boardData 의존성 캡슐화)
 */
import { boardData } from '@/data/boardData';

const POST_CATEGORY_LABELS: Record<string, string> = {
  REQUEST: '구해요 전체',
  REQUEST_STUDY: '구해요 스터디',
  REQUEST_PROJECT: '구해요 프로젝트',
  REQUEST_COMPETITION: '구해요 공모전/대회',
  REQUEST_GROUP: '구해요 소모임',
  COMMUNICATION: '소통해요 전체',
  COMMUNICATION_QUESTION: '소통해요 질문',
  COMMUNICATION_JOB: '소통해요 취업수기',
  COMMUNICATION_TIP: '소통해요 꿀팁공유',
  EXTRACURRICULAR: '비교과 전체',
  EXTRACURRICULAR_INNER: '비교과 정보대',
  EXTRACURRICULAR_STARINU: '비교과 StarINU',
  EXTRACURRICULAR_OUTER: '비교과 교외',
  POLL: '익명 투표',
  BOOKS_SELL: '중고 거래 팝니다',
  BOOKS_BUY: '중고 거래 삽니다',
  SONGDO_CAMPUS: '간식나눔 송도캠',
  MICHUHOL_CAMPUS: '간식나눔 미추홀캠',
};

export function mapPostCategoryToName(postCategory: string): string {
  const key = postCategory?.trim().toUpperCase();
  if (!key) return '알 수 없음';

  const exact = POST_CATEGORY_LABELS[key];
  if (exact) return exact;

  const prefix = key.split('_')[0];
  const fallback = POST_CATEGORY_LABELS[prefix];
  return fallback ?? '알 수 없음';
}

export function mapPostCategoryToBoardPath(postCategory: string): string | null {
  for (const boardKey in boardData) {
    const board = boardData[boardKey];
    const tab = board.tabs.find((tab) => tab.postCategory === postCategory);
    if (tab) return boardKey;
  }
  return null;
}

export function getBoardNameByCategory(postCategory: string): string | null {
  for (const key in boardData) {
    const board = boardData[key];
    const matchingTab = board.tabs.find((tab) => tab.postCategory === postCategory);
    if (matchingTab) return board.name;
  }
  return null;
}

export function getDefaultImageUrl(title: string): string {
  if (title.includes('[정통]')) return '/images/정보통신학과.png';
  if (title.includes('[컴공]')) return '/images/컴퓨터공학부.png';
  if (title.includes('[임베]')) return '/images/임베디드시스템공학과.png';
  if (title.includes('[정보대]')) return '/images/교학실.png';
  return '/images/교학실.png';
}
