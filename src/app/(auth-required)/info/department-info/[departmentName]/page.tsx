import DepartmentPageClient from './DepartmentPageClient';
import { getOfficeByDepartment } from '@/api/server';

interface PageProps {
  params: Promise<{ departmentName: string }>;
}

export default async function DepartmentRoutePage({ params }: PageProps) {
  const { departmentName } = await params;
  const initialInfo = await getOfficeByDepartment(departmentName);

  return (
    <DepartmentPageClient
      departmentName={departmentName}
      initialInfo={initialInfo}
    />
  );
}
