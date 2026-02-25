'use client';

import { useSelectedPostModal } from '@/features/board/hooks/useSelectedPostModal';
import { PostListBody } from './PostListBody';
import FullScreenPostModal from '../common/FullScreenPostModal';
import PostDetailView from '../post/PostDetailView';
import type { Post } from '@/types/post';

interface PostListProps {
  posts: Post[];
  boardName: string;
  boardType: string;
}

export default function PostList({
  posts,
  boardName,
  boardType,
}: PostListProps) {
  const { selectedPost, openModal, closeModal } = useSelectedPostModal(posts);

  return (
    <div>
      <PostListBody
        posts={posts}
        boardName={boardName}
        boardType={boardType}
        onPostClick={openModal}
      />
      {selectedPost && (
        <FullScreenPostModal onClose={closeModal} post={selectedPost}>
          <PostDetailView postId={selectedPost._id} />
        </FullScreenPostModal>
      )}
    </div>
  );
}
