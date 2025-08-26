'use client';

import { FC, useState, useEffect, useRef } from 'react';
import apiClient from '@/api/clients/apiClient';
import PostList from '@/components/board/PostList';
import { Post } from '@/interfaces/Post';
import { FaSearch } from 'react-icons/fa'; // FaSearch 아이콘 import
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { Suspense } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';

const SearchPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isFetching = useRef(false);

  const fetchSearchResults = async (query: string, pageNumber: number) => {
    if (isFetching.current || !query.trim()) return;

    try {
      setIsLoading(true);
      isFetching.current = true;

      const response = await apiClient.get('/posts/search', {
        params: {
          keyword: query,
          pageNumber,
        },
      });

      if (response.data.success) {
        const contents = Array.isArray(response.data.data.contents)
          ? response.data.data.contents
          : [];

        setPosts(prevPosts =>
          pageNumber === 0 ? contents : [...prevPosts, ...contents]
        );

        if (response.data.data.nextPage === -1) {
          setHasMore(false);
        }
      } else {
        console.error('검색 데이터 로드 실패:', response.data.message);
      }
    } catch (error) {
      console.error('검색 API 호출 오류:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const handleSearch = () => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchSearchResults(searchQuery, 0);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300 &&
        !isLoading &&
        hasMore &&
        !isFetching.current
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 0) {
      fetchSearchResults(searchQuery, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Suspense>
      <div className={'w-full h-full'}>
        <Header title="검색" />
        <DefaultBody hasHeader={1}>
          {/* 검색창 및 검색 버튼 */}
          <div className="relative flex items-center w-full">
            <input
              className="flex-1 w-full rounded-full bg-gray-50 py-3 px-5 pr-12 focus:outline-none focus:ring-0" // pr-12로 오른쪽 여백 확보
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyPress={e => {
                if (e.key === 'Enter') handleSearch(); // 엔터 키로 검색 가능
              }}
            />
            {/* 검색 버튼 (입력창 내부 오른쪽) */}
            <button
              onClick={handleSearch}
              className="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaSearch
                className="w-5 h-5"
                color="#5f98f7"
              />
            </button>
          </div>

          {/* 검색 결과 목록 */}
          <PostList
            posts={posts}
            boardName="search"
            boardType="listWithCategory"
          />

          {/* 로딩 상태 표시 */}
          {isLoading && (
            <div className="text-center my-[18px] text-sub text-Lm">
              검색 중...
            </div>
          )}

          {/* 검색 결과가 없을 때 표시 */}
          {!hasMore && !isLoading && posts.length === 0 && (
            <div className="text-center my-[18px] text-sub text-Lm">
              검색 결과가 없습니다.
            </div>
          )}
        </DefaultBody>
      </div>
    </Suspense>
  );
};

export default SearchPage;
