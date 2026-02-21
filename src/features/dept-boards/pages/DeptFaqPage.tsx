'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import ShadowBox from '@/components/common/shadowBox';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Faq } from '@/features/dept-boards/types';

interface DeptFaqPageProps {
  dept?: string;
  initialFaqs?: Faq[];
}

export default function DeptFaqPage({
  dept: deptProp,
  initialFaqs = [],
}: DeptFaqPageProps = {}) {
  const searchParams = useSearchParams();
  const dept = deptProp ?? searchParams.get('dept') ?? 'COMPUTER_SCI';

  const [questions, setQuestions] = useState<Faq[]>(
    initialFaqs.length > 0 ? initialFaqs : []
  );

  useEffect(() => {
    if (dept === deptProp && initialFaqs.length > 0) return;

    const fetchFaqs = async () => {
      try {
        const response = await fetchClient(`/question?department=${dept}`);
        const data: Faq[] = response.dataList ?? [];
        setQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, [dept]);

  return (
    <>
      {questions.map(faq => (
        <ShadowBox
          key={faq.id}
          className="p-[20px] mb-[22px]"
        >
          <h3 className="font-bold text-[14px] text-active">
            Q. {faq.question}
          </h3>
          <p className="text-[12px] font-medium text-sub mt-[6px]">
            A. {faq.answer}
          </p>
        </ShadowBox>
      ))}
    </>
  );
}
