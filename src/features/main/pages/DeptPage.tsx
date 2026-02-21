'use client';

import Notice from '@public/icons/notice.svg';
import Question from '@public/icons/question.svg';
import Opinion from '@public/icons/opinion.svg';

import ShadowBox from '@/components/common/shadowBox';
import NotionContainer from '@/features/dept-boards/components/NotionContainer';
import QuestionContainer from '@/features/dept-boards/components/QuestionContainer';
import DeptHeader from '@/features/dept-boards/components/DeptHeader';
import CustomSelect from '@/features/courses/components/CourseCustomSelect';
import { Tag } from '@/types/partners';
import { useEffect, useMemo, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import type {
  Faq,
  NoticeData,
  Opinion as OpinionType,
} from '@/features/dept-boards/types';
import { useDeptStore } from '@/hooks/useDeptStore';

function timeAgo(createdAt: string | number | Date) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime(); // 밀리초 차이
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}일 전`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}년 전`;
}

export default function DeptPage() {
  const { dept, setDept } = useDeptStore();
  const departments = [
    ['컴퓨터공학부', 'COMPUTER_SCI'],
    ['컴퓨터공학부', 'COMPUTER_SCI'],
    ['임베디드 시스템공학부', 'EMBEDDED'],
  ];
  const handleDeptChange = (value: string) => {
    localStorage.setItem('dept', value);
    setDept(value as Tag);
  };

  const [questions, setQuestions] = useState<Faq[]>([]);
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [voices, setVoices] = useState<OpinionType[]>([]);
  const [page, setPage] = useState(0);

  const fetchNoticeData = async () => {
    try {
      const response = await fetchClient(
        `/notice/category?department=${dept}&page=${page}`
      );
      const data: NoticeData[] = response.data.contents;
      console.log(data);
      setNotices(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  useEffect(() => {
    if (!dept) return;
    const fetchOpinions = async () => {
      try {
        // Fetch opinions from the server (dummy endpoint used here)
        const response = await fetchClient(
          `/voice-box?department=${dept}&page=${page}`
        );
        const data: OpinionType = response.data;
        console.log('익명의소리함', data);
        setVoices(data.contents);
      } catch (error) {
        console.error('Error fetching opinions:', error);
      }
    };
    const fetchFaqs = async () => {
      try {
        const response = await fetchClient(`/question?department=${dept}`);
        const data: Faq[] = response.dataList;
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
    fetchOpinions();
    fetchFaqs();
    fetchNoticeData();
  }, [dept]);

  const mappingDept = useMemo(() => {
    switch (dept) {
      case 'COMPUTER_SCI':
        return '컴퓨터공학부';
      case 'INFO_COMM':
        return '정보통신공학부';
      case 'EMBEDDED':
        return '임베디드시스템공학부';
      default:
        return '컴퓨터공학부';
    }
  }, [dept]);

  return (
    <>
      <div className="flex items-center mb-[11px]">
        <CustomSelect
          onChange={handleDeptChange}
          options={departments}
          defaultValue={mappingDept || '컴퓨터공학부'}
          onlyText
        />
        <span className="pl-[6px] font-bold text-black">학과 게시판</span>
      </div>

      {/* 학과 공지사항 */}
      <ShadowBox>
        <DeptHeader
          SVG={Notice}
          title="공지사항"
          href={`/dept-boards/notice?dept=${dept}`}
        />
        {notices && notices.length > 0 && (
          <div className="mt-[2px] px-[7px] mb-[10px]">
            <NotionContainer
              title={notices[0].title}
              content={notices[0].content}
              nickname={notices[0].nickname}
              time={timeAgo(notices[0].createdAt)}
            />
            <hr className="h-[1px] my-[9px]" />
            <NotionContainer
              title={notices[1].title}
              content={notices[1].content}
              nickname={notices[1].nickname}
              time={timeAgo(notices[1].createdAt)}
            />
          </div>
        )}
      </ShadowBox>

      {/* 학과 Q&A */}
      <ShadowBox className="mt-[22px]">
        <DeptHeader
          SVG={Question}
          title="자주 묻는 질문"
          href={`/dept-boards/faq?dept=${dept}`}
        />
        {questions && questions.length > 0 && (
          <div className="mt-[14px] px-[7px] mb-[10px]">
            <QuestionContainer
              question={questions[0].question}
              answer={questions[0].answer}
            />
            <hr className="h-[1px] my-[9px]" />
            <QuestionContainer
              question={questions[1].question}
              answer={questions[1].answer}
            />
          </div>
        )}
      </ShadowBox>

      {/* <ShadowBox
        id="ananymous-voice-box"
        className="mt-[22px] pb-[22px]"
      >
        <DeptHeader
          SVG={Opinion}
          title="익명의 소리함"
          href={`/dept-boards/opinion?dept=${dept}`}
        />
        {voices && voices.length > 0 ? (
          <div className="mt-[7px] px-[7px] mb-[10px]">
            <div>
              <div className="my-[20px] mx-[14px]">
                <div className="text-active font-bold text-[12px]">
                  5월 학우들의 목소리
                </div>
                <div className="mt-[6px] font-bold text-[14px] break-all overflow-ellipsis">
                  학회비 낸 사람은 얼마나 이득인가요?
                </div>
              </div>
              <hr className="h-[1px] w-full my-[20px]" />
              <div className="flex flex-col items-center">
                <div className="text-Mm">100% 이득입니다</div>
                <div className="flex justify-between gap-[19px] mt-[15px]">
                  <div className="bg-main text-white rounded-[20px] px-[14px] py-[7px] text-Mm">
                    <span>공감해요</span>
                    <span className="pl-[4px]">0</span>
                  </div>
                  <div className="bg-main text-white rounded-[20px] px-[14px] py-[7px] text-Mm">
                    <span>공감해요</span>
                    <span className="pl-[4px]">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-[22px] text-sub text-center">
            목소리를 찾을 수 없습니다
          </div>
        )}
      </ShadowBox> */}
    </>
  );
}
