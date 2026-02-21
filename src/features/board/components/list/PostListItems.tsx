'use client';

import PostItem from '../post/PostItem/PostItem';
import type { Post } from '@/types/post';

interface PostListItemsProps {
  posts: Post[];
  boardName: string;
  boardType: string;
  onPostClick: (post: Post) => void;
}

export function PostListItems({
  posts,
  boardName,
  boardType,
  onPostClick,
}: PostListItemsProps) {
  return (
    <ul
      className={
        boardType === 'gallery'
          ? 'grid grid-cols-2 mt-[18px] gap-4'
          : 'grid grid-cols-1 mt-[18px] gap-[24px]'
      }
    >
      {posts.map((post) => (
        <PostItem
          key={post._id}
          post={post}
          boardName={boardName}
          boardType={boardType}
          onOpenModal={() => onPostClick(post)}
        />
      ))}
    </ul>
  );
}
