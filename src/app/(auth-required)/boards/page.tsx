'use client';

import ShadowBox from '@/components/common/shadowBox';
import { boardData } from '@/data/boardData';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import Search from '@public/icons/search.svg';
import NeedHelp from '@public/icons/need-help.svg';
import Vote from '@public/icons/vote.svg';
import Communicate from '@public/icons/communicate.svg';
import { useEffect, useState, useRef } from 'react';
import apiClient from '@/api/clients/apiClient';
import Link from 'next/link';
import { Post } from '@/interfaces/Post';
import PostList from '@/components/board/PostList';

const mapPostCategoryToBoardPath = (postCategory: string): string | null => {
  for (const boardKey in boardData) {
    const board = boardData[boardKey];
    const tab = board.tabs.find(tab => tab.postCategory === postCategory);
    if (tab) return boardKey; // 해당 게시판 경로 반환
  }
  return null; // 매칭되는 게시판이 없을 경우
};

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  }
};

export default function Board() {
  const [rankingPosts, setRankingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState(false);
  const isFetching = useRef(false);

  const fetchSearchResults = async (query: string, pageNumber: number) => {
    if (isFetching.current || !query.trim()) return;

    try {
      setIsLoading(true);
      setIsSearching(true);
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
    setIsSearching(true);
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


  useEffect(() => {
    const fetchRankingPosts = async () => {
      try {
        const response = await apiClient.get('/posts/top3');
        console.log(response.data);
        setRankingPosts(response.data.dataList || []); // 데이터 구조에 따라 수정
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingPosts();
  }, []);

  return (
    <>
      <Header
        showBack
        title="커뮤니티"
      />
      <DefaultBody hasHeader={1}>
        <div className="flex relative justify-center items-center bg-[#F9F9F9] w-full h-[46px] px-[20px] rounded-[14px] shadow-[0px_6px_7.2px_#B6B6B64D] gap-[16px] z-[60]">
          <input
            type="text"
            className="w-full px-[20px] text-[13px] bg-transparent placeholder:text-[#CDCDCD] outline-none"
            placeholder="검색어를 입력하세요."
            onBlur={e => setSearchQuery(e.target.value)}
          />
          <div
            onClick={handleSearch}
            className="cursor-pointer"
          >
            <Search
              width={20}
              height={20}
            />
          </div>
        </div>
         {/* 🔄 검색 모드일 때: 검색 결과 렌더링 */}
        {isSearching ? (
          <>
            {/* 검색 결과 목록 */}
            <PostList posts={posts} boardName="search" boardType="listWithCategory" />

            {/* 로딩 상태 표시 */}
            {isLoading && (
              <div className="text-center my-[18px] text-sub text-Lm">검색 중...</div>
            )}

            {/* 검색 결과가 없을 때 표시 */}
            {!hasMore && !isLoading && posts.length === 0 && (
              <div className="text-center my-[18px] text-sub text-Lm">
                검색 결과가 없습니다.
              </div>
            )}
          </>
        ) : (
          <>
          {/* 기본 섹션들 (검색 전/검색모드 해제 시) */}
          <ShadowBox className="px-[15px] py-[1px] mt-[22px]">
            <Link
              href={'/boards/need-help'}
              className="flex items-center py-[15px]"
            >
              <div className="flex justify-center items-center w-[48px] aspect-square rounded-full shadow-05134">
                <NeedHelp />
              </div>
              <div className="ml-[15px]">
                <div className="font-bold text-[14px]">구해요 게시판</div>
                <div className="font-medium text-[10px] mt-[4px] opacity-[61%]">
                  프로젝트 팀원, 스터디, 소모임 무엇이든 구해요에서 구해요!
                </div>
              </div>
            </Link>
            <hr />
            <Link
              href={'/boards/communicate'}
              className="flex items-center py-[15px]"
            >
              <div className="flex justify-center items-center w-[48px] aspect-square rounded-full shadow-05134">
                <Communicate />
              </div>
              <div className="ml-[15px]">
                <div className="font-bold text-[14px]">소통해요 게시판</div>
                <div className="font-medium text-[10px] mt-[4px] opacity-[61%]">
                  졸업생, 선배님, 후배님, 학우님! 꿀팁, 질문 소통해요!
                </div>
              </div>
            </Link>
            <hr />
            <Link
              href={'/vote'}
              className="flex items-center py-[15px]"
            >
              <div className="flex justify-center items-center w-[48px] aspect-square rounded-full shadow-05134">
                <Vote />
              </div>
              <div className="ml-[15px]">
                <div className="font-bold text-[14px]">익명 투표 게시판</div>
                <div className="font-medium text-[10px] mt-[4px] opacity-[61%]">
                  솔직한 학우들의 의견이 궁금할 땐? 익명투표 게시판!
                </div>
              </div>
            </Link>
          </ShadowBox>

          <section className="">
            <div className="font-bold text-[16px] mt-[36px]">
              <span>실시간</span> <span className="text-active">HOT</span>{' '}
              <span>게시물</span>
            </div>
            <div className="pt-[26px] mb-[18px] flex flex-col gap-[27px]">
              {loading ? (
                <p className="text-center text-sub">
                  랭킹 데이터를 불러오는 중입니다...
                </p>
              ) : error ? (
                <p className="text-center text-sub">{error}</p>
              ) : rankingPosts.length > 0 ? (
                rankingPosts.map((post, index) => {
                  const boardPath = mapPostCategoryToBoardPath(post.postCategory);
                  return boardPath ? (
                    <Link
                      key={index}
                      href={`/boards/${boardPath}?postId=${post._id}`}
                      className="block"
                    >
                      <div className="flex flex-col gap-[8px] bg-white">
                        <div className="flex-1 w-full">
                          <div>
                            <p className="text-sr text-sub px-[4px] py-[2px] bg-[#F2F2F2] rounded-[3px] inline">
                              {boardData[boardPath]?.name || '알 수 없음'}
                            </p>
                          </div>
                          <h3 className="text-Lm mt-[8px]">{post.title}</h3>
                          <p className="text-Mr text-sub mt-[4px] mb-[8px]">
                            {post.content}
                          </p>
                          <div className="flex justify-between items-center text-sr text-sub">
                            <div className="flex space-x-[6px]">
                              <span className="flex items-center gap-[4.33px]">
                                <img
                                  src="/icons/board/viewIcon.svg"
                                  width={16}
                                  height={16}
                                  alt="조회수 아이콘"
                                />
                                {post.hits || 0}
                              </span>
                              <span className="flex items-center gap-[4.33px]">
                                <img
                                  src="/icons/board/heartIcon.svg"
                                  width={16}
                                  height={16}
                                  alt="좋아요 아이콘"
                                />
                                {post.likeCount || 0}
                              </span>
                              <span className="flex items-center gap-[4.33px]">
                                <img
                                  src="/icons/board/commentIcon.svg"
                                  width={16}
                                  height={16}
                                  alt="댓글 아이콘"
                                />
                                {post.commentCount || 0}
                              </span>
                            </div>
                            <div className="flex items-centertext-sub space-x-1 text-sr">
                              <span>
                                {post.anonymous ? '익명' : post.nickname}
                              </span>
                              <span> · </span>
                              <span>{timeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : null;
                })
              ) : (
              <>
                <p className="text-center text-gray-500">게시물이 없습니다.</p>
              </>
            )}
          </div>
        </section>
        </>
        )}
      </DefaultBody>
    </>
  );
}
