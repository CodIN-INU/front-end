import DeptOpinionPage from '@/features/dept-boards/pages/DeptOpinionPage';
import { getDeptOpinions } from '@/api/server';

interface PageProps {
  searchParams: Promise<{ dept?: string }>;
}

export default async function DeptOpinionRoutePage({ searchParams }: PageProps) {
  const { dept } = await searchParams;
  const department = dept || 'COMPUTER_SCI';
  const { contents, nextPage } = await getDeptOpinions(department, 0);

  return (
    <DeptOpinionPage
      dept={department}
      initialVoices={contents}
      initialNextPage={nextPage}
    />
  );
}
