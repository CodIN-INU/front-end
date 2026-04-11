'use client';

interface PostDetailViewCountProps {
  hits: number;
}

/** 게시글 조회수 한 줄 (본문 하단·투표 상세 등에서 공통 사용) */
export function PostDetailViewCount({ hits }: PostDetailViewCountProps) {
  return (
    <div>
      <span className="flex items-center gap-[4.33px] text-[#ABABAB] text-[12px]">
        <img
          src="/icons/board/viewIcon.svg"
          width={16}
          height={16}
          alt="조회수"
        />
        {hits || 0}명이 봤어요
      </span>
    </div>
  );
}
