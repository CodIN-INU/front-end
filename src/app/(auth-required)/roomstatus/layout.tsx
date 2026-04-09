import { Suspense } from 'react';
import { DefaultBody } from '@/shared/ui';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>

      </Suspense>
      <DefaultBody headerPadding="compact">{children}</DefaultBody>
    </>
  );
}
