'use client';

import { fetchClient } from '@/shared/api/fetchClient';
import { useEffect, useState } from 'react';

export interface ProfessorPost {
  id: string;
  title: string;
  content: string;
  professor: string;
}

interface LabApiResponse {
  success: boolean;
  dataList?: ProfessorPost[];
  message?: string;
}

interface ProfessorClientProps {
  initialPosts?: ProfessorPost[];
}

export default function ProfessorClient({
  initialPosts = [],
}: ProfessorClientProps = {}) {
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [professorPosts, setProfessorPosts] = useState<ProfessorPost[]>(
    initialPosts.length > 0 ? initialPosts : []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPosts.length > 0) return;

    const fetchProfessorPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchClient<LabApiResponse>('/info/lab');
        if (response.success) {
          setProfessorPosts(response.dataList ?? []);
        } else {
          setError(response.message ?? '데이터를 가져오는 데 실패했습니다.');
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : err && typeof err === 'object' && 'message' in err
              ? String((err as { message: unknown }).message)
              : '알 수 없는 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorPosts();
  }, [initialPosts.length]);

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {professorPosts.map(post => (
            <li
              key={post.id}
              className="p-4 border rounded-lg shadow-05134 bg-white"
            >
              <h2 className="font-bold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-1">{post.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                담당 교수: {post.professor}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
