import DeptFaqPage from '@/features/dept-boards/pages/DeptFaqPage';
import { getDeptFaqs } from '@/api/server';

interface PageProps {
  searchParams: Promise<{ dept?: string }>;
}

export default async function DeptFaqRoutePage({ searchParams }: PageProps) {
  const { dept } = await searchParams;
  const department = dept || 'COMPUTER_SCI';
  const initialFaqs = await getDeptFaqs(department);

  return (
    <DeptFaqPage
      dept={department}
      initialFaqs={initialFaqs}
    />
  );
}
