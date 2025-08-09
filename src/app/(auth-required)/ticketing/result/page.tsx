// app/(auth-required)/ticketing/result/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TicketingResultInner = dynamic(
  () => import('./TicketingResultInner'),
  { ssr: false } // ✅ 핵심: 빌드/SSR에서 제외 → CSR만
);

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <TicketingResultInner />
    </Suspense>
  );
}
