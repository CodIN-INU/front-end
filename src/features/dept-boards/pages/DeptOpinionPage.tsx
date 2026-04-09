'use client';

import Sad from '@public/icons/sad.svg';

import { fetchClient } from '@/shared/api/fetchClient';
import { ShadowBox, Title } from '@/shared/ui';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Opinion } from '@/features/dept-boards/types';

interface DeptOpinionPageProps {
  dept?: string;
  initialVoices?: any[];
  initialNextPage?: number;
}

export default function DeptOpinionPage({
  dept: deptProp,
  initialVoices = [],
  initialNextPage = -1,
}: DeptOpinionPageProps = {}) {
  const searchParams = useSearchParams();
  const dept = deptProp ?? searchParams.get('dept') ?? 'COMPUTER_SCI';

  const [page, setPage] = useState(0);
  const [voices, setVoices] = useState<any[]>(
    initialVoices.length > 0 ? initialVoices : []
  );
  const [myVoice, setMyVoice] = useState('');

  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = 'auto'; // Reset height
      textarea.current.style.height = `${textarea.current.scrollHeight}px`; // Set to scroll height
    }
  };

  interface VoiceEvent extends React.ChangeEvent<HTMLTextAreaElement> {}

  const handleVoice = (e: VoiceEvent): void => {
    setMyVoice(e.target.value);
    handleResizeHeight();
  };

  const uploadVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (myVoice.length === 0) {
        alert('의견을 입력해주세요');
        return;
      }
      // Upload voice to the server (dummy endpoint used here)
      await fetchClient('/voice-box', {
        method: 'POST',
        body: JSON.stringify({
          department: dept,
          content: myVoice,
        }),
      });
      alert('의견이 성공적으로 전송되었습니다.');
      setMyVoice('');
      if (textarea.current) {
        textarea.current.value = '';
        textarea.current.style.height = 'auto'; // Reset height
      }
      // Optionally, refresh the list of voices
      setPage(0); // Reset to first page
      // Fetch updated opinions
      const response = await fetchClient<{
        data?: { contents?: unknown[] };
      }>(`/voice-box?department=${dept}&page=0`);
      const data = response?.data;
      setVoices(Array.isArray(data?.contents) ? data.contents : []);
    } catch (error) {
      console.error('Error uploading voice:', error);
      alert('의견 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (dept === deptProp && initialVoices.length > 0 && page === 0) return;

    const fetchOpinions = async () => {
      try {
        const response = await fetchClient<{
          data?: { contents?: unknown[] };
        }>(`/voice-box?department=${dept}&page=${page}`);
        const data = response?.data;
        setVoices(Array.isArray(data?.contents) ? data.contents : []);
      } catch (error) {
        console.error('Error fetching opinions:', error);
      }
    };
    fetchOpinions();
  }, [dept, page]);

  return (
    <>
      <ShadowBox className="py-[14px] px-[20px]">
        <h2 className="text-[14px] font-bold text-center">
          <p>익명으로 질문하세요!</p>
          <Title className="!text-[14px]">
            학생회는 당신의 목소리가 필요합니다
          </Title>
        </h2>
        <form
          onSubmit={uploadVoice}
          className="flex flex-col items-center"
        >
          <textarea
            ref={textarea}
            placeholder="당신의 의견을 들려주세요"
            onChange={handleVoice}
            className={clsx(
              'px-[18px] py-[10px] text-[12px] font-normal text-sub shadow-05134 bg-[#F9F9F9] rounded-[14px] w-full',
              'placeholder:text-center placeholder:leading-[36px] mt-[10px] mb-[15px] resize-none h-[56px]'
            )}
          />
          <button
            type="submit"
            className={clsx(
              'py-[7px] px-[21px] text-[14px] font-medium  text-center rounded-[20px]',
              myVoice.length > 0 ? 'bg-main text-white' : 'bg-sub text-sub'
            )}
          >
            전송하기
          </button>
        </form>
      </ShadowBox>
      <div className="relative mt-[22px]">
        {voices.length > 0 ? (
          ''
        ) : (
          <ShadowBox className="px-[15px] pt-[21px] pb-[24px]">
            <div className="font-bold">
              <div className="text-[12px] text-active">
                {null}월 학우들의 목소리
              </div>
              <div className="mt-[6px] text-[14px]">
                학회비 낸 사람은 얼마나 이득인가요? (dummy)
              </div>
            </div>
            <hr className="mt-[15px]" />
            <div className="flex flex-col items-center">
              <div className="text-center text-[40px]">🤔</div>
              <div className="text-Mm">100% 이득입니다</div>
              <div className="flex justify-between gap-[19px] mt-[15px]">
                <div className="bg-main text-white rounded-[20px] px-[14px] py-[7px] text-Mm">
                  <span>공감해요</span>
                  <span className="pl-[4px]">0</span>
                </div>
                <div className="bg-main text-white rounded-[20px] px-[14px] py-[7px] text-Mm">
                  <span>아쉬워요</span>
                  <span className="pl-[4px]">0</span>
                </div>
              </div>
            </div>
          </ShadowBox>
        )}
      </div>
    </>
  );
}
