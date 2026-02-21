'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/clients/apiClient';
import { boardData } from '@/data/boardData';
import { FEATURES } from '@/config/features';

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  return `${Math.floor(diffInSeconds / 86400)}일 전`;
};

const mapPostCategoryToBoardPath = (postCategory: string): string | null => {
  for (const boardKey in boardData) {
    const board = boardData[boardKey];
    const tab = board.tabs.find(tab => tab.postCategory === postCategory);
    if (tab) return boardKey;
  }
  return null;
};

interface RankingPost {
  _id: string;
  title: string;
  content: string;
  postCategory: string;
  hits?: number;
  likeCount?: number;
  commentCount?: number;
  anonymous?: boolean;
  nickname?: string;
  createdAt: string;
}

interface MainRankingSectionProps {
  initialRankingPosts?: RankingPost[];
}

const MainRankingSection = ({
  initialRankingPosts: initial,
}: MainRankingSectionProps) => {
  const [rankingPosts, setRankingPosts] = useState<RankingPost[]>(
    initial && initial.length > 0 ? initial : []
  );
  const [loading, setLoading] = useState(!(initial && initial.length > 0));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial && initial.length > 0) return;
    const fetchRankingPosts = async () => {
      try {
        const response = await apiClient.get('/posts/top3');
        setRankingPosts(response.data.dataList || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRankingPosts();
  }, [initial]);

  return (
    <section className="mt-[48px]">
      <h2 className="text-XLm">{'게시물 랭킹'}</h2>
      <div className="pt-[26px] mb-[18px] flex flex-col gap-[27px]">
        {loading ? (
          <p className="text-center text-sub">
            랭킹 데이터를 불러오는 중입니다...
          </p>
        ) : error ? (
          <p className="text-center text-sub">{error}</p>
        ) : rankingPosts.length > 0 ? (
          rankingPosts.map((post, index) => {
            const boardPath = mapPostCategoryToBoardPath(post.postCategory);
            if (!boardPath) return null;
            if (boardPath === 'extracurricular' && !FEATURES.EXTRACURRICULAR) return null;
            return (
              <Link
                key={index}
                href={`/boards/${boardPath}?postId=${post._id}`}
                className="block"
              >
                <div className="flex flex-col gap-[8px] bg-white">
                  <div className="flex-1 w-full">
                    <div>
                      <p className="text-sr text-sub px-[4px] py-[2px] bg-[#F2F2F2] rounded-[3px] inline">
                        {boardData[boardPath]?.name || '알 수 없음'}
                      </p>
                    </div>
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
                            alt="조회수 아이콘"
                          />
                          {post.hits || 0}
                        </span>
                        <span className="flex items-center gap-[4.33px]">
                          <img
                            src="/icons/board/heartIcon.svg"
                            width={16}
                            height={16}
                            alt="좋아요 아이콘"
                          />
                          {post.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-[4.33px]">
                          <img
                            src="/icons/board/commentIcon.svg"
                            width={16}
                            height={16}
                            alt="댓글 아이콘"
                          />
                          {post.commentCount || 0}
                        </span>
                      </div>
                      <div className="flex items-centertext-sub space-x-1 text-sr">
                        <span>{post.anonymous ? '익명' : post.nickname}</span>
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
};

export default MainRankingSection;

