'use client';

import type { Post } from '@/types/post';
import ZoomableImageModal from '@/components/modals/ZoomableImageModal';
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
    </>
  );
}
