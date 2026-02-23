'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import PostList from '@/features/board/components/list/PostList';
import { useUserBoardPosts } from '../hooks/useUserBoardPosts';
import type { UserBoardType } from '../api/fetchUserBoardPosts';

const VALID_BOARDS: UserBoardType[] = ['posts', 'likes', 'comments', 'scraps'];

export default function MyBoardPage() {
  const params = useParams();
  const board = params.board as string;
  const boardType = VALID_BOARDS.includes(board as UserBoardType)
    ? (board as UserBoardType)
    : null;

  const { posts, isLoading, hasMore, headerTitle } = useUserBoardPosts(
    boardType
  );

  if (!boardType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          존재하지 않는 마이페이지 보드입니다.
        </h2>
      </div>
    );
  }

  return (
    <>
      <Header
        title={headerTitle}
        showBack
        tempBackOnClick="/mypage"
      />
      <DefaultBody headerPadding="compact">
        <PostList
          posts={posts}
          boardName={board}
          boardType="myboard"
        />

        {isLoading && (
          <div className="text-center mt-[24px] text-Mm text-sub">
            로딩 중...
          </div>
        )}

        {!hasMore && !isLoading && posts.length === 0 && (
          <div className="text-center mt-[24px] text-Mm text-sub">
            게시물이 없습니다.
          </div>
        )}
      </DefaultBody>
    </>
  );
}
