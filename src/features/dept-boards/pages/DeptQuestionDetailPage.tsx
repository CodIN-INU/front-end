'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import ShadowBox from '@/components/common/shadowBox';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DeptNoticePost } from '@/api/server';

export interface Post {
  _id: string;
  userId: string;
  postCategory: 'DEPARTMENT_NOTICE' | string; // 필요한 경우 enum으로 세분화 가능
  title: string;
  content: string;
  nickname: string;
  userImageUrl: string;
  postImageUrl: string[];
  scrapCount: number;
  hits: number;
  createdAt: string; // Date 객체로 변환할 경우 Date로 바꿔도 됨
  userInfo: {
    scrap: boolean;
    mine: boolean;
  };
  anonymous: boolean;
}

function formatDateTime(createdAt: string) {
  const date = new Date(createdAt.replace(' ', 'T')); // 공백을 'T'로 치환해서 ISO 파싱

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0~11이므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}
function parseContentToHtml(content: string): string {
  if (!content) return '';

  // 표 외 일반 텍스트 줄바꿈 처리
  let html = content.replace(/(?<!\\)\n/g, '<br/>');

  const tableRegex = /\[\[([\s\S]*?)\]\]/g;
  html = html.replace(tableRegex, match => {
    try {
      const arr: any[][] = JSON.parse(match.replace(/'/g, '"'));
      if (!Array.isArray(arr)) return match;
      return buildMergedTableHtml(arr);
    } catch {
      return match;
    }
  });

  return html;
}

/** 2차원 배열을 받아 colspan/rowspan 병합된 <table> HTML 생성 (세로→가로 병합, 오너십 엄격) */
function buildMergedTableHtml(matrix: any[][]): string {
  const rows = matrix.map(r => r.map(v => (v == null ? '' : String(v))));
  const H = rows.length;
  const W = Math.max(...rows.map(r => r.length));

  type Cell = {
    text: string;
    skip: boolean; // 다른 셀에 병합되어 렌더링 생략
    colspan: number;
    rowspan: number;
    ownerUp: boolean; // 위쪽 셀에 소속(세로 병합으로 흡수됨)
  };

  const grid: Cell[][] = Array.from({ length: H }, (_, i) =>
    Array.from({ length: W }, (_, j) => ({
      text: rows[i][j] ?? '',
      skip: false,
      colspan: 1,
      rowspan: 1,
      ownerUp: false,
    }))
  );

  // 1) 세로 병합 (rowspan) 먼저: 위쪽 텍스트 셀에 아래 연속 ''를 흡수
  for (let j = 0; j < W; j++) {
    for (let i = 0; i < H; i++) {
      const cell = grid[i][j];
      if (cell.skip || cell.text === '') continue;

      let span = 1;
      let r = i + 1;
      while (r < H && grid[r][j].text === '' && !grid[r][j].skip) {
        grid[r][j].skip = true;
        grid[r][j].ownerUp = true; // 이 빈칸은 위 셀 소유
        span++;
        r++;
      }
      cell.rowspan = span;
    }
  }

  // 2) 가로 병합 (colspan): 같은 행에서 연속된 빈칸을 "왼쪽 텍스트 셀"에 흡수
  //    단, 그 빈칸이 ownerUp=true(위로 이미 붙은 칸)이면 건드리지 않음.
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      const cell = grid[i][j];
      if (cell.skip || cell.text === '') continue;

      let span = 1;
      let k = j + 1;
      while (
        k < W &&
        grid[i][k].text === '' &&
        !grid[i][k].skip &&
        !grid[i][k].ownerUp // 세로로 이미 위에 붙은 칸은 가로 병합 금지
      ) {
        grid[i][k].skip = true;
        span++;
        k++;
      }
      cell.colspan = span;
    }
  }

  // 3) HTML 출력
  let html =
    '<div class="w-full overflow-x-scroll"><table style="border-collapse:collapse;text-align:center;border:1px solid #e5e7eb;margin:8px 0;">';

  for (let i = 0; i < H; i++) {
    html += '<tr>';
    for (let j = 0; j < W; j++) {
      const c = grid[i][j];
      if (c.skip || c.text === '') continue;

      const cs = c.colspan > 1 ? ` colspan="${c.colspan}"` : '';
      const rs = c.rowspan > 1 ? ` rowspan="${c.rowspan}"` : '';
      const txt = c.text.replace(/\\n/g, '<br/>');

      html += `<td${cs}${rs} style="border:1px solid #e5e7eb;padding:8px;">${txt}</td>`;
    }
    html += '</tr>';
  }
  html += '</table></div>';
  return html;
}

interface DeptQuestionDetailPageProps {
  noticeId?: string;
  dept?: string;
  initialNotice?: DeptNoticePost | null;
}

export default function DeptQuestionDetailPage({
  noticeId: noticeIdProp,
  dept: deptProp,
  initialNotice,
}: DeptQuestionDetailPageProps = {}) {
  const param = useParams();
  const searchParams = useSearchParams();
  const noticeId = noticeIdProp ?? (Array.isArray(param.id) ? param.id[0] : param.id);
  const dept = deptProp ?? searchParams.get('dept') ?? 'COMPUTER_SCI';

  const [notice, setNotice] = useState<Post | null>(
    initialNotice ? (initialNotice as Post) : null
  );

  const parsingTitle = (str: string) => {
    switch (str) {
      case 'COMPUTER_SCI':
        return '컴퓨터공학과';
      case 'COMM_INFO':
        return '정보통신공학과';
      case 'EMBEDDED':
        return '임베디드시스템공학과';
    }
    return '컴퓨터공학과';
  };

  useEffect(() => {
    if (!noticeId) return;
    if (initialNotice) return;

    const fetchNoticeData = async () => {
      try {
        const response = await fetchClient(`/notice/${noticeId}`);
        const data: Post = response.data;
        setNotice(data);
      } catch (error) {
        console.error('Error fetching notice:', error);
      }
    };

    fetchNoticeData();
  }, [noticeId, initialNotice]);

  if (!notice) {
    return (
      <>
        {/* Header 등 기존 컴포넌트 */}
        <div className="p-4 text-sm text-sub">불러오는 중…</div>
      </>
    );
  }

  const html = parseContentToHtml(notice.content);

  return (
    <>
      <Header
        showBack
        title={parsingTitle(dept) + ' 게시판'}
      />
      <DefaultBody hasHeader={1}>
        <ShadowBox className="overflow-hidden">
          <div className="py-[15px] px-[12px]">
            <div className="flex items-center min-w-[106px] gap-[17px] overflow-hidden">
              <img
                src="/icons/chat/DeafultProfile.png"
                className="w-[36px] h-[36px]"
                width={36}
                height={36}
              />
              <div className="text-[12px] text-normal">
                <p className="font-medium">{notice.nickname}</p>
                <p className="mt-[4px] text-active">
                  {formatDateTime(notice.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div className="relative w-full mt-[30px] pb-[20px] px-[20px]">
            <div>{notice.title}</div>
            <div
              className="mt-[8px] leading-6 text-[14px]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </ShadowBox>
      </DefaultBody>
    </>
  );
}
