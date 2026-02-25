import BoardListPage from '@/features/board/pages/BoardListPage';
import { boardData } from '@/data/boardData';
import { getPostsByCategory } from '@/server/getPostsByCategory';

interface PageProps {
  params: Promise<{ boardName: string }>;
}

export default async function BoardRoutePage({ params }: PageProps) {
  const { boardName } = await params;
  const board = boardData[boardName];

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          존재하지 않는 게시판입니다.
        </h2>
      </div>
    );
  }

  const defaultPostCategory = board.tabs[0]?.postCategory ?? '';
  const { posts, nextPage } = await getPostsByCategory(defaultPostCategory, 0);

  return (
    <BoardListPage
      boardName={boardName}
      initialPosts={posts}
      initialNextPage={nextPage}
    />
  );
}
