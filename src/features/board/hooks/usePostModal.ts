'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Post } from '@/types/post';

/**
 * 게시물 클릭 시 모달 + URL postId 동기화
 */
export function usePostModal(posts: Post[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId) {
      const post = posts.find((p) => p._id === postId);
      setSelectedPost(post ?? null);
    } else {
      setSelectedPost(null);
    }
  }, [searchParams, posts]);

  const openModal = (post: Post) => {
    setSelectedPost(post);
    const url = new URL(window.location.href);
    url.searchParams.set('postId', post._id);
    router.push(url.toString());
  };

  const closeModal = () => {
    setSelectedPost(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('postId');
    router.push(url.toString());
  };

  return { selectedPost, openModal, closeModal };
}
