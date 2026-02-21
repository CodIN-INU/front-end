export interface Course {
  id: number;
  title: string;
  professor: string;
  type: string; // 예: "전공핵심", "전공선택" 등
  grade: number; // 학년
  credit: number; // 학점
  tags: string[];
  liked: boolean; // 로그인한 유저가 좋아요를 눌렀는지 여부
  department: string; // 학과 문자열 리터럴로 해야될수도
  likes: number;
  starRating: number; // 평점 0~5
}

export interface CourseDetail extends Course {
  college: string; // 예: "정보기술대학"
  evaluation: string; // 예: "상대평가", "절대평가"
  lectureType: string; // 예: "강의(이론)", "실습" 등
  schedule: {
    day: string; // 요일 (예: "MONDAY", "TUESDAY" 등)
    start: string; // 시작 시간 (예: "09:00")
    end: string; // 종료 시간 (예: "10:30")
  }[];
  preCourse?: string[] | null; // 선수과목
  emotion?: {
    hard: number; // 어려움 정도 백분율
    ok: number; // 보통 정도 백분율
    best: number; // 최고 정도 백분율
  };
  openKeyword?: boolean; // 키워드 공개 여부
}

export const exampleCourse: CourseDetail = {
  id: 3,
  title: '대학수학(1)',
  professor: '한상현',
  type: '기초교양',
  grade: 1,
  credit: 3,
  tags: [],
  department: '컴퓨터공학부',
  college: '정보기술대학',
  evaluation: '상대평가',
  lectureType: '강의(이론)',
  schedule: [
    { day: 'THURSDAY', start: '13:00', end: '15:50' },
    { day: 'THURSDAY', start: '09:00', end: '10:15' },
    { day: 'THURSDAY', start: '10:30', end: '11:45' },
  ],
  preCourse: null,
  emotion: {
    hard: 0,
    ok: 100,
    best: 0,
  },
  openKeyword: false,
  likes: 0,
  starRating: 3,
  liked: null,
};

export interface CourseReview {
  id: number;
  content: string;
  starRating: number; // 평점 0~5
  likeCount: number; // 좋아요 수
  semester: string; // 예: "25-1"
  likes: number;
  liked: boolean; // 로그인한 유저가 좋아요를 눌렀는지 여부
}

