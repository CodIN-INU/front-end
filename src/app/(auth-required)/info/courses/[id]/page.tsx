import CourseDetailPage from '@/features/courses/pages/CourseDetailPage';
import { getCourseById } from '@/api/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  const initialCourse = await getCourseById(id);

  return (
    <CourseDetailPage
      courseId={id}
      initialCourse={initialCourse}
    />
  );
}
