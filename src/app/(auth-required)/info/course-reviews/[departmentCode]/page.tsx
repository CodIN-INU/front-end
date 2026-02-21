import DepartmentReviewClient from '@/features/course-reviews/pages/DepartmentReviewClient';
import { getLectureRatingInfo, getLectureReviews } from '@/api/server';

interface PageProps {
  params: Promise<{ departmentCode: string }>;
}

export default async function DepartmentReviewRoutePage({
  params,
}: PageProps) {
  const { departmentCode } = await params;

  const [initialLectureInfo, { contents: initialReviewList }] = await Promise.all([
    getLectureRatingInfo(departmentCode),
    getLectureReviews(departmentCode, 0),
  ]);

  return (
    <DepartmentReviewClient
      initialLectureInfo={initialLectureInfo}
      initialReviewList={initialReviewList}
    />
  );
}
