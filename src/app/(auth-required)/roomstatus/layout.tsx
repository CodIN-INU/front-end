import { Suspense } from 'react';
import DefaultBody from '@/shared/ui/layout/Body/defaultBody';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>

      </Suspense>
      <DefaultBody headerPadding="compact">{children}</DefaultBody>
    </>
  );
}
