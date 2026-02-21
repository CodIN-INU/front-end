'use client';

import type { Post } from '@/types/post';

interface PostDetailHeaderProps {
  post: Post;
}

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
  const displayName = post.anonymous ? '익명' : post.nickname || '익명';
  const avatarSrc = post.anonymous
    ? '/images/anonymousUserImage.png'
    : post.userImageUrl;

  return (
    <div className="flex items-center space-x-[12px] mb-[20px]">
      <div className="w-[36px] h-[36px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={`${displayName} profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-600 text-sm">No Image</span>
        )}
      </div>
      <div>
        <h4 className="text-sm">{displayName}</h4>
        <p className="text-sr text-sub">{post.createdAt}</p>
      </div>
    </div>
  );
}
