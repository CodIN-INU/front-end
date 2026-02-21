'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/api/clients/apiClient';
import type { Post } from '@/types/post';

export function useTopPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await apiClient.get('/posts/top3');
        setPosts(response.data.dataList ?? []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  return { posts, loading, error };
}
