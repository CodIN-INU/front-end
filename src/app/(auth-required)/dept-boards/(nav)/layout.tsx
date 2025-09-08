import { Suspense } from 'react';
import DeptBoardsHeader from './header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <DeptBoardsHeader>{children}</DeptBoardsHeader>
    </Suspense>
  );
}
