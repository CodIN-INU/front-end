import { Suspense } from 'react';
import DeptBoardsHeader from '@/features/dept-boards/components/DeptBoardsHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <DeptBoardsHeader>{children}</DeptBoardsHeader>
    </Suspense>
  );
}
