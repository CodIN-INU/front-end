'use client';

import { fetchClient } from '@/shared/api/fetchClient';
import { PartnerLinkCard } from '@/features/department-info/components/PartnerLinkCard';
import { IPartners } from '@/types/partners';
import { useEffect, useState } from 'react';

interface PartnersClientProps {
  initialPartners?: IPartners[];
}

export default function PartnersClient({
  initialPartners = [],
}: PartnersClientProps = {}) {
  const [loading, setLoading] = useState(initialPartners.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<IPartners[]>(
    initialPartners.length > 0 ? initialPartners : []
  );

  useEffect(() => {
    if (initialPartners.length > 0) return;

    const fetchData = async () => {
      try {
        const res = await fetchClient<{ dataList?: IPartners[] }>('/info/partner');
        setPartners(res.dataList ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : err && typeof err === 'object' && 'message' in err
              ? String((err as { message: unknown }).message)
              : '알 수 없는 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialPartners.length]);

  return (
    <ul className="grid grid-cols-2 place-items-center gap-[11px] w-full">
      {partners.map(partner => (
        <li
          key={partner.id}
          className="flex justify-center items-center"
        >
          <PartnerLinkCard partner={partner} />
        </li>
      ))}
    </ul>
  );
}
