import DeptQuestionDetailPage from '@/features/dept-boards/pages/DeptQuestionDetailPage';
import { getDeptNoticeById } from '@/api/server';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ dept?: string }>;
}

export default async function DeptQuestionDetailRoutePage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { dept } = await searchParams;
  const department = dept || 'COMPUTER_SCI';
  const initialNotice = await getDeptNoticeById(id);

  return (
    <DeptQuestionDetailPage
      noticeId={id}
      dept={department}
      initialNotice={initialNotice}
    />
  );
}
