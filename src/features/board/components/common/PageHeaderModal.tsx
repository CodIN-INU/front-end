'use client';

import { ReactNode } from 'react';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { PostDetailModalHeader } from '../modal/PostDetailModalHeader';
import type { Post } from '@/types/post';

interface PageHeaderModalProps {
  children: ReactNode;
  onClose: () => void;
  post: Post;
}

export default function PageHeaderModal({
  children,
  onClose,
  post,
}: PageHeaderModalProps) {
  return (
    <div
      id="scrollbar-hidden"
      className="fixed inset-0 bg-white z-50 overflow-y-scroll"
    >
      <PostDetailModalHeader post={post} onClose={onClose} />
      <DefaultBody hasHeader={1}>
        <div className="pt-[18px] overflow-y-auto">{children}</div>
      </DefaultBody>
    </div>
  );
}
