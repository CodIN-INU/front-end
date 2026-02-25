'use client';

import type { Post } from '@/types/post';
import CommentSection from '@/features/comment/components/CommentSection';
import {
  PostDetailHeader,
  PostDetailContent,
  PostDetailActions,
} from './PostDetail';
import { usePostDetail } from '../../hooks/usePostDetail';

interface PostDetailViewProps {
  postId: string;
  initialPost?: Post | null;
}

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <h2 className="text-xl font-semibold text-gray-700">로딩 중...</h2>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
  </div>
);

/** 글 상세 뷰 (헤더·본문·액션·댓글) */
export default function PostDetailView({
  postId,
  initialPost,
}: PostDetailViewProps) {
  const {
    post,
    loading,
    error,
    toggleLike,
    toggleBookmark,
  } = usePostDetail({ postId, initialPost });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!post) {
    return <ErrorState message="게시물을 찾을 수 없습니다." />;
  }

  return (
    <div className="bg-white min-h-screen flex justify-center">
      <div className="w-full max-w-[500px] px-4">
        <PostDetailHeader post={post} />
        <PostDetailContent post={post} />
        <PostDetailActions
          post={post}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
        />
        <CommentSection postId={postId} postName={post.title} />
      </div>
    </div>
  );
}
