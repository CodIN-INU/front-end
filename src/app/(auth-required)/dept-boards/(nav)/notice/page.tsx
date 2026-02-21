import DeptNoticePage from '@/features/dept-boards/pages/DeptNoticePage';
import { getDeptNotices } from '@/api/server';

interface PageProps {
  searchParams: Promise<{ dept?: string }>;
}

export default async function DeptNoticeRoutePage({ searchParams }: PageProps) {
  const { dept } = await searchParams;
  const department = dept || 'COMPUTER_SCI';
  const { notices, nextPage } = await getDeptNotices(department, 0);

  return (
    <DeptNoticePage
      dept={department}
      initialNotices={notices}
      initialNextPage={nextPage}
    />
  );
}
