export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface NoticeData {
  _id: string;
  userId: string;
  postCategory: string;
  title: string;
  content: string;
  nickname: string;
  postImageUrl: null | string;
  createdAt: string;
}

export interface Opinion {
  contents: [];
  lastPage: number;
  nextPage: number;
}
