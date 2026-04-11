'use client';

import type { Post } from '@/types/post';

export type PostDetailActionsPost = Pick<
  Post,
  'userInfo' | 'likeCount' | 'commentCount' | 'scrapCount'
>;

interface PostDetailActionsProps {
  post: PostDetailActionsPost;
  onLike: () => void;
  onBookmark: () => void;
}

export function PostDetailActions({
  post,
  onLike,
  onBookmark,
}: PostDetailActionsProps) {
  return (
    <div className="flex w-full justify-between items-center text-[12px] px-10 py-[22px] mt-[22px] text-[#ABABAB] shadow-[0px_5px_13.3px_0px_rgba(212,212,212,0.59)] rounded-b-[20px] border-t border-[#D4D4D4]">
        
        <button
          type="button"
          onClick={onLike}
          className="flex items-center gap-[4.33px]"
        >
          <img
            src={
              post.userInfo.like
                ? '/icons/board/active_heart.svg'
                : '/icons/board/heartIcon.svg'
            }
            width={20}
            height={20}
            alt="좋아요"
          />
          좋아요 {post.likeCount || 0}
        </button>
        
        <span className="flex items-center gap-[4.33px]">
          <img
            src="/icons/board/commentIcon.svg"
            width={20}
            height={20}
            alt="댓글"
          />
          댓글 {post.commentCount || 0}
        </span>
     
      <button
        type="button"
        onClick={onBookmark}
        className="flex items-center text-sub gap-[4.33px]"
      >
        <img
          src={
            post.userInfo.scrap
              ? '/icons/board/active_BookmarkIcon.svg'
              : '/icons/board/Bookmark.svg'
          }
          width={20}
          height={20}
          className={`w-[16px] h-[16px] ${
            post.userInfo.scrap ? 'text-yellow-300' : 'text-gray-500'
          }`}
          alt="북마크"
        />
        스크랩 {post.scrapCount}
      </button>
    </div>
  );
}
