'use client';

import { FC, useState } from 'react';
import { useParams } from 'next/navigation';
import PostList from '@/features/board/components/list/PostList';
import { WriteFloatingButton } from '@/features/board/components/common/WriteFloatingButton';
import { boardData } from '@/data/boardData';
import BoardLayout from '@/components/Layout/BoardLayout';
import { useBoardPosts } from '@/features/board/hooks/useBoardPosts';
import { useInfiniteScroll } from '@/features/board/hooks/useInfiniteScroll';

interface BoardListPageProps {
  boardName?: string;
  initialPosts?: import('@/types/post').Post[];
  initialNextPage?: number;
}

const BoardListPage: FC<BoardListPageProps> = ({
  boardName: boardNameProp,
  initialPosts = [],
  initialNextPage,
}) => {
  const params = useParams();
  const boardName = (boardNameProp ?? params.boardName) as string;
  const board = boardData[boardName];

  const hasTabs = board?.tabs?.length ? board.tabs.length > 0 : false;
  const defaultTab = hasTabs && board ? board.tabs[0].value : 'default';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const { posts, isLoading, hasMore, loadNextPage } = useBoardPosts({
    boardName,
    board: board ?? { name: '', tabs: [], type: 'list' },
    activeTab,
    initialPosts,
    initialNextPage,
    isSSRBoard: !!boardNameProp,
  });

  useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: loadNextPage,
  });

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          존재하지 않는 게시판입니다.
        </h2>
      </div>
    );
  }

  const { type: boardType } = board;

  return (
    <BoardLayout
      board={board}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <PostList posts={posts} boardName={boardName} boardType={boardType} />

      {isLoading && (
        <div className="text-center my-4 text-gray-500">로딩 중...</div>
      )}

      {!hasMore && !isLoading && posts.length === 0 && (
        <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
      )}

      <WriteFloatingButton href={`/boards/${boardName}/create`} />
    </BoardLayout>
  );
};

export default BoardListPage;
