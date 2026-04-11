'use client';

import type { Post } from '@/types/post';
import { ZoomableImageModal } from '@/shared/ui';
import { transStringToChartData } from '@/features/board/utils';

interface PostDetailContentProps {
  post: Post;
}

export function PostDetailContent({ post }: PostDetailContentProps) {
  return (
    <>
      <div>
        <h3 className="text-Lm mb-[12px]">{post.title}</h3>
        <span className="text-Mr mb-[24px] whitespace-pre-wrap">
          {transStringToChartData(post.content)}
        </span>
      </div>
      <div className="mb-[24px]">
        {post.postImageUrl && post.postImageUrl.length > 0 && (
          <ZoomableImageModal images={post.postImageUrl} />
        )}
      </div>
      <div>
      <span className="flex items-center gap-[4.33px] text-[#ABABAB] text-[12px]">
          <img
            src="/icons/board/viewicon.svg"
            width={16}
            height={16}
            alt="조회수"
          />
          {post.hits || 0}명이 봤어요
        </span>
        
      </div>

    </>
  );
}
