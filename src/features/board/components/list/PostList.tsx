'use client';

import { usePostModal } from '@/features/board/hooks/usePostModal';
import { PostListItems } from './PostListItems';
import PageHeaderModal from '../common/PageHeaderModal';
import PostDetailClient from '../post/PostDetailClient';
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
  const { selectedPost, openModal, closeModal } = usePostModal(posts);

  return (
    <div>
      <PostListItems
        posts={posts}
        boardName={boardName}
        boardType={boardType}
        onPostClick={openModal}
      />
      {selectedPost && (
        <PageHeaderModal onClose={closeModal} post={selectedPost}>
          <PostDetailClient postId={selectedPost._id} />
        </PageHeaderModal>
      )}
    </div>
  );
}
