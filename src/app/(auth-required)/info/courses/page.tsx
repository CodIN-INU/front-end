import CoursesPage from '@/features/courses/pages/CoursesPage';
import { getCourses } from '@/api/server';

export default async function CoursesRoutePage() {
  const { courses, nextPage } = await getCourses(0);

  return (
    <CoursesPage
      initialCourses={courses}
      initialNextPage={nextPage}
    />
  );
}
