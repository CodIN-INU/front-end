'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TicketingResultInner = dynamic(
  () => import('@/features/ticketing/components/TicketingResultInner'),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <TicketingResultInner />
    </Suspense>
  );
}
