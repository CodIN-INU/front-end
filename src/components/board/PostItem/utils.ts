import { boardData } from "@/data/boardData";

const POST_CATEGORY_LABELS = {
  // 구해요
  REQUEST: "구해요 전체",
  REQUEST_STUDY: "구해요 스터디",
  REQUEST_PROJECT: "구해요 프로젝트",
  REQUEST_COMPETITION: "구해요 공모전/대회",
  REQUEST_GROUP: "구해요 소모임",

  // 소통해요
  COMMUNICATION: "소통해요 전체",
  COMMUNICATION_QUESTION: "소통해요 질문",
  COMMUNICATION_JOB: "소통해요 취업수기",
  COMMUNICATION_TIP: "소통해요 꿀팁공유",

  // 비교과
  EXTRACURRICULAR: "비교과 전체",
  EXTRACURRICULAR_INNER: "비교과 정보대",
  EXTRACURRICULAR_STARINU: "비교과 StarINU",
  EXTRACURRICULAR_OUTER: "비교과 교외",

  // 투표
  POLL: "익명 투표",
} as const;

export const mapPostCategoryToName = (postCategory: string): string => {
  const key = postCategory?.trim().toUpperCase();
  if (!key) return "알 수 없음";

  // 1) 정확히 매칭
  const exact = (POST_CATEGORY_LABELS as Record<string, string>)[key];
  if (exact) return exact;

  // 2) 접두어 fallback (예: REQUEST_XXX → "구해요 전체")
  const prefix = key.split("_")[0];
  const fallback = (POST_CATEGORY_LABELS as Record<string, string>)[prefix];
  return fallback ?? "알 수 없음";
};

export const getDefaultImageUrl = (title: string): string => {
    if (title.includes("[정통]")) return "/images/정보통신학과.png";
    if (title.includes("[컴공]")) return "/images/컴퓨터공학부.png";
    if (title.includes("[임베]")) return "/images/임베디드시스템공학과.png";
    return "/images/교학실.png";
};

export const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
};


export const mapPostCategoryToBoardPath = (postCategory: string): string | null => {
    for (const boardKey in boardData) {
        const board = boardData[boardKey];
        const tab = board.tabs.find((tab) => tab.postCategory === postCategory);
        if (tab) return boardKey;
    }
    return null;
};
