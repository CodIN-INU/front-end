'use client';

import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import Search from '@public/icons/search.svg';
import PostList from '@/features/board/components/list/PostList';
import { HotRankingSection } from '@/features/board/components/list/HotRankingSection';
import { BoardLinkSection } from '@/features/board/components/list/BoardLinkSection';
import { useSearchPosts } from '@/features/board/hooks/useSearchPosts';
import { useTopPosts } from '@/features/board/hooks/useTopPosts';

export default function BoardsPage() {
  const { posts, loading, error } = useTopPosts();
  const {
    searchQuery,
    setSearchQuery,
    posts: searchPosts,
    isLoading: searchLoading,
    hasMore,
    isSearching,
    handleSearch,
  } = useSearchPosts();

  return (
    <>
      <Header showBack title="커뮤니티" tempBackOnClick="/main" />
      <DefaultBody hasHeader={1}>
        <form
          onSubmit={handleSearch}
          className="bg-white fixed top-[80px] left-1/2 -translate-x-1/2 right-0 z-50 w-full max-w-[410px]"
        >
          <div className="fixed pt-[3px] top-[-3px] flex relative justify-center items-center bg-[#F9F9F9] w-full h-[46px] px-[20px] rounded-[14px] shadow-[0px_6px_7.2px_#B6B6B64D] gap-[16px] z-[60]">
            <input
              type="text"
              className="w-full px-[20px] text-[13px] bg-transparent placeholder:text-[#CDCDCD] outline-none"
              placeholder="검색어를 입력하세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="검색어"
            />
            <button type="submit" className="cursor-pointer" aria-label="검색">
              <Search width={20} height={20} />
            </button>
          </div>
        </form>

        {isSearching ? (
          <>
            <div className="mt-[50px]">
              <PostList
                posts={searchPosts}
                boardName="search"
                boardType="listWithCategory"
              />
            </div>
            {searchLoading && (
              <div className="text-center my-[18px] text-sub text-Lm">
                검색 중...
              </div>
            )}
            {!hasMore && !searchLoading && searchPosts.length === 0 && (
              <div className="text-center my-[18px] text-sub text-Lm">
                검색 결과가 없습니다.
              </div>
            )}
          </>
        ) : (
          <>
            <BoardLinkSection />
            <HotRankingSection posts={posts} loading={loading} error={error} />
          </>
        )}
      </DefaultBody>
    </>
  );
}
