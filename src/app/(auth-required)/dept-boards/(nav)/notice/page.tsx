'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import ShadowBox from '@/components/common/shadowBox';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NoticeData } from '../type';
import Title from '@/components/common/title';

function timeAgo(createdAt: string | number | Date) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
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

export default function DeptNoticePage() {
  const param = usePathname();
  const dept = param.split('?dept=')[1] || 'COMPUTER_SCI';

  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [page, setPage] = useState<number>(0); // 첫 페이지: 0
  const [next, setNext] = useState<number>(0); // 다음 페이지 번호(응답 기준)
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // dept 변경 시 초기화
  useEffect(() => {
    setNotices([]);
    setPage(0);
    setNext(0);
  }, [dept]);

  // 페이지 로드
  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    const load = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await fetchClient(
          `/notice/category?department=${dept}&page=${page}`,
          { signal: controller.signal as any }
        );

        // fetchClient가 응답의 data.data를 풀어서 넘긴다고 가정: { contents, lastPage, nextPage }
        const {
          contents,
          nextPage,
        }: { contents: NoticeData[]; lastPage: number; nextPage: number } =
          res.data ?? { contents: [], lastPage: 0, nextPage: -1 };

        setNotices(prev => {
          const seen = new Set(prev.map(it => it._id));
          const add = (contents ?? []).filter(it => !seen.has(it._id));
          return prev.concat(add);
        });

        setNext(typeof nextPage === 'number' ? nextPage : -1);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.error('Error fetching notices:', e);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    load();

    return () => {
      aborted = true;
      controller.abort();
    };
  }, [dept, page /* eslint-disable-line react-hooks/exhaustive-deps */]);

  // 무한 스크롤 옵저버
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (!first.isIntersecting) return;
        if (loading) return;
        if (next === -1) return; // 더 없음
        setPage(next); // 다음 페이지는 API가 준 nextPage로 이동
      },
      { rootMargin: '200px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, next]);

  return (
    <>
      {notices &&
        notices.length > 0 &&
        notices.map((item, index) => (
          <Link
            key={item._id ?? index}
            href={`/dept-boards/q/${item._id}?dept=${dept}`}
            className="mb-[22px]"
          >
            <ShadowBox className="p-[20px]">
              <Title className="text-[14px] font-bold">{item.title}</Title>
              <div className="mt-[10px] mb-[22px] text-[12px] font-normal overflow-ellipsis line-clamp-3">
                {item.content}
              </div>
              <div className="absolute bottom-[14px] right-[20px] text-[10px] text-[#AEAEAE]">
                {item.nickname} | {timeAgo(item.createdAt)}
              </div>
            </ShadowBox>
          </Link>
        ))}

      {/* 스타일 영향 없는 트리거 엘리먼트 */}
      <div
        ref={loaderRef}
        aria-hidden
      />
    </>
  );
}
