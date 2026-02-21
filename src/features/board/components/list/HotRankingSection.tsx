'use client';

import Link from 'next/link';
import { boardData } from '@/data/boardData';
import { FEATURES } from '@/config/features';
import { mapPostCategoryToBoardPath, timeAgo } from '@/features/board/utils';
import type { Post } from '@/types/post';

interface HotRankingSectionProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export function HotRankingSection({
  posts,
  loading,
  error,
}: HotRankingSectionProps) {
  return (
    <section>
      <div className="font-bold text-[16px] mt-[36px]">
        <span>실시간</span> <span className="text-active">HOT</span>{' '}
        <span>게시물</span>
      </div>
      <div className="pt-[26px] mb-[18px] flex flex-col gap-[27px]">
        {loading ? (
          <p className="text-center text-sub">랭킹 데이터를 불러오는 중입니다...</p>
        ) : error ? (
          <p className="text-center text-sub">{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => {
            const boardPath = mapPostCategoryToBoardPath(post.postCategory);
            if (!boardPath) return null;
            if (boardPath === 'extracurricular' && !FEATURES.EXTRACURRICULAR) return null;
            return (
              <Link
                key={post._id ?? index}
                href={`/boards/${boardPath}?postId=${post._id}`}
                className="block"
              >
                <div className="flex flex-col gap-[8px] bg-white">
                  <div className="flex-1 w-full">
                    <p className="text-sr text-sub px-[4px] py-[2px] bg-[#F2F2F2] rounded-[3px] inline">
                      {boardData[boardPath]?.name ?? '알 수 없음'}
                    </p>
                    <h3 className="text-Lm mt-[8px]">{post.title}</h3>
                    <p className="text-Mr text-sub mt-[4px] mb-[8px]">
                      {post.content}
                    </p>
                    <div className="flex justify-between items-center text-sr text-sub">
                      <div className="flex space-x-[6px]">
                        <span className="flex items-center gap-[4.33px]">
                          <img
                            src="/icons/board/viewIcon.svg"
                            width={16}
                            height={16}
                            alt="조회수"
                          />
                          {post.hits ?? 0}
                        </span>
                        <span className="flex items-center gap-[4.33px]">
                          <img
                            src="/icons/board/heartIcon.svg"
                            width={16}
                            height={16}
                            alt="좋아요"
                          />
                          {post.likeCount ?? 0}
                        </span>
                        <span className="flex items-center gap-[4.33px]">
                          <img
                            src="/icons/board/commentIcon.svg"
                            width={16}
                            height={16}
                            alt="댓글"
                          />
                          {post.commentCount ?? 0}
                        </span>
                      </div>
                      <div className="flex items-center text-sub space-x-1 text-sr">
                        <span>
                          {post.anonymous ? '익명' : post.nickname ?? '익명'}
                        </span>
                        <span> · </span>
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-center text-gray-500">게시물이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
