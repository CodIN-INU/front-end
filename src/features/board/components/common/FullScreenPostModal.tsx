'use client';

import { ReactNode } from 'react';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { PostDetailModalBar } from '../modal/PostDetailModalBar';
import type { Post } from '@/types/post';

interface FullScreenPostModalProps {
  children: ReactNode;
  onClose: () => void;
  post: Post;
}

/** 글 상세 전체화면 모달 (상단 바 + 본문) */
export default function FullScreenPostModal({
  children,
  onClose,
  post,
}: FullScreenPostModalProps) {
  return (
    <div
      id="scrollbar-hidden"
      className="fixed inset-0 bg-white z-50 overflow-y-scroll"
    >
      <PostDetailModalBar post={post} onClose={onClose} />
      <DefaultBody headerPadding="compact">
        <div className="pt-[18px] overflow-y-auto">{children}</div>
      </DefaultBody>
    </div>
  );
}
