'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import CourseCard from '@/components/info/courses/card';
import CustomSelect from '@/components/info/courses/customSelect';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { Course } from '@/interfaces/course';
import CheckBox from '@public/icons/checkbox.svg';
import Search from '@public/icons/search.svg';
import Sad from '@public/icons/sad.svg';
import { Suspense, useEffect, useState, useRef, useCallback } from 'react';

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  type Filters = {
    dept: string;
    order: string;
    query: string;
    fav: boolean;
  };

  const [filters, setFilters] = useState<Filters>({
    dept: 'ALL',
    order: 'ALL',
    query: '',
    fav: false,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const observer = useRef<IntersectionObserver | null>(null);

  const departments = [
    ['전체 학과', 'ALL'],
    ['컴퓨터공학부', 'COMPUTER_SCI'],
    ['정보통신공학부', 'INFO_COMM'],
    ['임베디드 시스템공학부', 'EMBEDDED'],
  ];
  const orders = [
    ['정렬 순서', 'ALL'],
    ['평점 높은 순', 'RATING'],
    ['좋아요 많은 순', 'LIKE'],
    ['조회수 순', 'HIT'],
  ];

  const fetchCourses = async (page: number, filters: Filters) => {
    if (isLoading) return; // 이미 로딩 중이면 무시

    try {
      const { dept, order, query, fav } = filters;
      setIsLoading(true);

      const res = await fetchClient(
        `/lectures/courses?page=${page}` +
          (query ? `&keyword=${encodeURIComponent(query)}` : '') +
          (dept !== 'ALL' ? `&department=${dept}` : '') +
          (order !== 'ALL' ? `&sort=${order}` : '') +
          (fav ? `&like=${fav}` : '')
      );

      const data = res.data;
      console.log(data);
      const newCourses: Course[] = data.contents;

      setCourses(prev => [...prev, ...newCourses]);
      setHasMore(data.nextPage !== -1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const lastCourseRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1); // 페이지 증가
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const updateFilters = (newValues: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newValues }));
    setPage(0); // 💡 중복 제거 완료!
  };

  const handleDepartmentChange = (value: string) =>
    updateFilters({ dept: value });
  const handleOrderChange = (value: string) => updateFilters({ order: value });
  const handleSearch = () => updateFilters({ query: searchQuery });
  const handleLikeToggle = () => updateFilters({ fav: !filters.fav });

  useEffect(() => {
    setCourses([]);
    setHasMore(true);
    setPage(0); // 스크롤 카운터 리셋

    // 여기서 바로 0페이지 요청 (이게 핵심)
    fetchCourses(0, filters);
  }, [filters]);

  useEffect(() => {
    if (page > 0) {
      fetchCourses(page, filters);
    }
  }, [page, filters]);

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>교과목 검색 및 추천</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="sticky top-[80px] bg-white z-10">
          <div className="flex relative justify-center items-center bg-[#F9F9F9] w-full h-[46px] px-[20px] rounded-[14px] shadow-[0px_6px_7.2px_#B6B6B64D] gap-[16px] z-[60]">
            <input
              type="text"
              className="w-full px-[20px] text-[13px] bg-transparent placeholder:text-[#CDCDCD] outline-none"
              placeholder="과목명, 관심분야, 희망 직무를 검색해보세요"
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
          <div className="flex relative justify-end gap-[8px] mt-[28px] mb-[29px] h-[35px] z-[70]">
            <CustomSelect
              onChange={handleDepartmentChange}
              options={departments}
            />
            <CustomSelect
              onChange={handleOrderChange}
              options={orders}
            />
          </div>
          <div className="relative pb-[14px] border-b-[1px] border-[#D4D4D4] z-[60]">
            <div
              className="flex items-center gap-[11px] w-fit cursor-pointer"
              onClick={handleLikeToggle}
            >
              <CheckBox
                width={14.25}
                height={14.25}
                stroke={filters.fav ? '#0D99FF' : '#CDCDCD'}
              />
              <h3
                className="text-Mm text-[#808080]"
                style={{
                  color: filters.fav ? '#0D99FF' : '#808080',
                }}
              >
                좋아요한 과목 모아보기
              </h3>
            </div>
          </div>
          <div className="absolute w-[110%] h-[175px] -left-[20px] bg-white top-0 z-10 rounded-[30px]"></div>
        </div>
        {courses.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center gap-[17px] mt-[18vh]">
            <Sad />
            <div className="col-span-2 text-center text-sub text-[14px]">
              일치하는 검색 결과가 없습니다.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[18px] pt-[12px]">
            {courses.map((v, i) => {
              const isLast = i === courses.length - 1;
              return (
                <CourseCard
                  key={v.id}
                  ref={isLast ? lastCourseRef : null}
                  value={v}
                  fav={v.liked}
                />
              );
            })}
          </div>
        )}
      </DefaultBody>
    </Suspense>
  );
}
