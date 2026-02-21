import CourseReviewPage from '@/features/course-reviews/pages/CourseReviewPage';
import { getCourseReviews } from '@/api/server';

export default async function CourseReviewsRoutePage() {
  const { contents, nextPage } = await getCourseReviews(
    'COMPUTER_SCI',
    0,
    { option: 'LEC' }
  );

  return (
    <CourseReviewPage
      initialContents={contents}
      initialNextPage={nextPage}
    />
  );
}
