'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostList from '@/components/board/PostList';
import { boardData } from '@/data/boardData';
import { Post } from '@/interfaces/Post';
import apiClient from '@/api/clients/apiClient'; // <-- apiClient import

import BoardLayout from '@/components/Layout/BoardLayout';

const BoardPage: FC = () => {
  const params = useParams();
  const boardName = params.boardName as string;
  const board = boardData[boardName];

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          존재하지 않는 게시판입니다.
        </h2>
      </div>
    );
  }

  const { tabs, type: boardType } = board;
  const hasTabs = tabs.length > 0;
  const defaultTab = hasTabs ? tabs[0].value : 'default';

  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isFetching = useRef(false);

  // 게시물 요청 함수
  const fetchPosts = async (pageNumber: number) => {
    // 이미 요청 중이면 중복 요청 방지
    if (isFetching.current) return;

    try {
      const activePostCategory =
        tabs.find(tab => tab.value === activeTab)?.postCategory || '';

      console.log(
        'API 호출: 카테고리',
        activePostCategory,
        '페이지:',
        pageNumber
      );

      setIsLoading(true);
      isFetching.current = true;

      // apiClient 사용
      const response = await apiClient.get('/posts/category', {
        params: {
          postCategory: activePostCategory,
          page: pageNumber,
        },
      });

      if (response.data.success) {
        const contents = Array.isArray(response.data.data.contents)
          ? response.data.data.contents
          : [];

        console.log('가져온 데이터:', contents);

        setPosts(prevPosts => [...prevPosts, ...contents]);

        if (response.data.data.nextPage === -1) {
          setHasMore(false);
          console.log('더 이상 데이터가 없습니다.');
        }
      } else {
        console.error('데이터 로드 실패:', response.data.message);
      }
    } catch (error: any) {
      console.error('API 호출 오류:', error);
      // 401 에러 등의 처리는 apiClient 내부 인터셉터에서 처리 가능
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  // 게시판 초기화
  useEffect(() => {
    const initializeBoard = async () => {
      setIsLoading(true);
      try {
        setPosts([]); // 기존 게시물 목록 초기화
        setPage(0);
        setHasMore(true);
        await fetchPosts(0); // 첫 페이지부터 로드
      } catch (error) {
        console.error('초기화 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardName, activeTab]);

  // 스크롤에 의한 무한 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300 &&
        !isLoading &&
        hasMore &&
        !isFetching.current
      ) {
        console.log('스크롤 이벤트: 다음 페이지 로드');
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  // page 변경 시 새로운 데이터 요청
  useEffect(() => {
    if (page >= 0) {
      console.log('페이지 변경: 새 데이터 요청 ->', page);
      fetchPosts(page);
    }
  }, [page]);

  return (
    <BoardLayout
      board={board}
      activeTab={activeTab}
      onTabChange={tab => {
        console.log('탭 변경:', tab);
        setActiveTab(tab);
      }}
    >
      {/* 게시물 리스트 */}
      <PostList
        posts={posts}
        boardName={boardName}
        boardType={boardType}
      />

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="text-center my-4 text-gray-500">로딩 중...</div>
      )}

      {/* 데이터가 없을 때 안내 메시지 */}
      {!hasMore && !isLoading && posts.length === 0 && (
        <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
      )}

      {/* 글쓰기 버튼 */}
      <div className="absolute right-[78px]">
        <Link
          href={`/boards/${boardName}/create`}
          className="fixed bottom-[108px] bg-main text-white rounded-full shadow-lg p-4 hover:bg-blue-600 transition duration-300"
          aria-label="글쓰기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.80002 14.5999L8.00002 18.1999M3.20002 14.5999L15.0314 2.35533C16.3053 1.08143 18.3707 1.08143 19.6446 2.35533C20.9185 3.62923 20.9185 5.69463 19.6446 6.96853L7.40002 18.7999L1.40002 20.5999L3.20002 14.5999Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </div>
    </BoardLayout>
  );
};

export default BoardPage;
