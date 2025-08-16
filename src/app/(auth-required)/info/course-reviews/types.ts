export type labelType = {
  label: string,
  value: string
}

export type searchTypesType = {
  label: "과목명" | "교수명";
  value: "LEC" | "PROF";
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