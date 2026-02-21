'use client';

import type { Post } from '@/types/post';

interface PostDetailActionsProps {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
}

export function PostDetailActions({
  post,
  onLike,
  onBookmark,
}: PostDetailActionsProps) {
  return (
    <div className="flex justify-between items-center text-sr text-sub">
      <div className="flex space-x-[12px]">
        <span className="flex items-center gap-[4.33px]">
          <img
            src="/icons/board/viewIcon.svg"
            width={16}
            height={16}
            alt="조회수"
          />
          {post.hits || 0}
        </span>
        <button
          type="button"
          onClick={onLike}
          className="flex items-center gap-[4.33px]"
        >
          <img
            src={
              post.userInfo.like
                ? '/icons/board/active_heartIcon.svg'
                : '/icons/board/heartIcon.svg'
            }
            width={16}
            height={16}
            alt="좋아요"
          />
          {post.likeCount || 0}
        </button>
        <span className="flex items-center gap-[4.33px]">
          <img
            src="/icons/board/commentIcon.svg"
            width={16}
            height={16}
            alt="댓글"
          />
          {post.commentCount || 0}
        </span>
      </div>
      <button
        type="button"
        onClick={onBookmark}
        className="flex items-center text-sub gap-[4.33px]"
      >
        <img
          src={
            post.userInfo.scrap
              ? '/icons/board/active_BookmarkIcon.svg'
              : '/icons/board/BookmarkIcon.svg'
          }
          width={16}
          height={16}
          className={`w-[16px] h-[16px] ${
            post.userInfo.scrap ? 'text-yellow-300' : 'text-gray-500'
          }`}
          alt="북마크"
        />
        <span>{post.scrapCount}</span>
      </button>
    </div>
  );
}
