// 목록/검색
export type labelType = {
  label: string;
  value: string;
};

export type searchTypesType = {
  label: '평점순' | '좋아요순' | '인기순';
  value: 'RATING' | 'LIKE' | 'HIT';
};

export type reviewContentType = {
  _id: string;
  lectureNm: string;
  professor: string;
  starRating: number;
  participants: number;
  grade: number;
  semesters: string[];
};

// [departmentCode] 학과별 리뷰
export type lectureInfoType = {
  _id: string;
  lectureNm: string;
  professor: string;
  starRating: number;
  participants: number;
  grade: number;
  semesters: string[];
};

export type emotionType = {
  ok: number;
  best: number;
  hard: number;
};

export type reviewType = {
  _id: string;
  lectureId: string;
  userId: string;
  content: string;
  starRating: number;
  likeCount: number;
  liked: boolean;
  semester: string;
};

// write-review
export type selectType = {
  label: string;
  value: string;
};

export type departMentType = {
  _id: string;
  lectureNm: string;
  professor: string;
};
