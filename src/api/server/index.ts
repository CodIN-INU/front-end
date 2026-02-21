/**
 * 서버 전용 API (Server Components에서만 사용)
 */

export { serverFetch } from './serverFetch';
export type { ServerFetchOptions } from './serverFetch';

// 게시판
export { getPostById } from './getPost';
export { getPostsByCategory } from './getPostsByCategory';
export type { GetPostsByCategoryResult } from './getPostsByCategory';

// 투표
export { getVotes } from './getVotes';
export { getVoteById } from './getVoteById';
export type { GetVotesResult, VoteListItem } from './getVotes';
export type { VoteDetail } from './getVoteById';

// 메인
export { getTopPosts } from './getTopPosts';
export type { RankingPost } from './getTopPosts';
export { getRoomStatus } from './getRoomStatus';

// 강의
export { getCourses } from './getCourses';
export { getCourseById } from './getCourseById';
export type { GetCoursesResult } from './getCourses';

// 학과 게시판
export {
  getDeptNotices,
  getDeptFaqs,
  getDeptOpinions,
} from './getDeptPosts';
export { getDeptNoticeById } from './getDeptNoticeById';
export type { GetDeptNoticeResult } from './getDeptPosts';
export type { DeptNoticePost } from './getDeptNoticeById';

// 티켓팅
export { getTicketingEvents } from './getTicketingEvents';
export { getTicketingEventById } from './getTicketingEventById';
export type { GetTicketingEventsResult } from './getTicketingEvents';

// 학과 정보
export {
  getPartners,
  getPartnerById,
  getOfficeByDepartment,
  getProfessorLabList,
} from './getDepartmentInfo';

// 강의 리뷰
export {
  getCourseReviews,
  getLectureRatingInfo,
  getLectureReviews,
} from './getCourseReviews';
export type {
  GetCourseReviewsResult,
  CourseReviewListItem,
  LectureRatingInfo,
  ReviewComment,
} from './getCourseReviews';
