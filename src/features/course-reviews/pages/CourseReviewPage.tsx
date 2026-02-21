'use client';

import SmRoundedBtn from '@/components/buttons/smRoundedBtn';
import { DEPARTMENTS, SEARCHTYPES } from '@/features/course-reviews/constants';
import { labelType, reviewContentType, searchTypesType } from '@/features/course-reviews/types';
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Input } from '@/components/input/Input';
import debounce from 'lodash/debounce';
import { UnderbarBtn } from '@/components/buttons/underbarBtn';
import { Subject } from '@/features/course-reviews/components/Subject';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { useReviewsContext } from '@/api/review/getReviewsContext';
import { ReviewBtn } from '@/features/course-reviews/components/ReviewBtn';
import { ReviewContext } from '@/context/WriteReviewContext';

interface CourseReviewPageProps {
  initialContents?: reviewContentType[];
  initialNextPage?: number;
}

const CourseReviewPage = ({
  initialContents = [],
  initialNextPage = -1,
}: CourseReviewPageProps = {}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({
    label: '컴공',
    value: 'COMPUTER_SCI',
  });
  const [searchType, setSearchType] = useState<searchTypesType>({
    label: '과목명',
    value: 'LEC',
  });

  const [query, setQuery] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [reviewContents, setReviewContents] = useState<reviewContentType[]>(
    initialContents.length > 0 ? initialContents : []
  );
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(initialContents.length === 0);
  const [hasMore, setHasMore] = useState(
    initialContents.length > 0 ? initialNextPage >= 0 : true
  );
  const [loadState, setLoadState] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const { data, setData } = useContext(ReviewContext);

  const selectDepartmentHandler = (
    selectedLabel: string,
    selectedValue: string
  ) => {
    setSelectedDepartment({ label: selectedLabel, value: selectedValue });
    setData({
      ...data,
      departments: { label: selectedLabel, value: selectedValue },
    });
    setPage(0);
    setReviewContents([]);
    setHasMore(true);
  };

  const onSearchTypeChange = ({ label, value }: searchTypesType) => {
    setSearchType({ label, value });
    setPage(0);
    setReviewContents([]);
    setHasMore(true);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        setSearchKeyword(keyword);
        setPage(0);
        setReviewContents([]);
        setHasMore(true);
      }, 200),
    []
  );

  const onSearchKeywordChange = (keyword: string) => {
    setQuery(keyword);
    debouncedSearch(keyword);
  };

  const getReviewsContent = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await useReviewsContext({
        department: selectedDepartment.value,
        keyword: searchKeyword,
        option: searchType.value,
        page: page,
      });

      const contents = result.data?.contents ?? [];
      setReviewContents(prev => [...prev, ...contents]);
      setHasMore(contents.length > 0);
    } catch (err) {
      alert('데이터를 불러오지 못했습니다');
      setHasMore(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setData({
      departments: selectedDepartment,
      grade: { label: '', value: '' },
    });
  }, []);

  useEffect(() => {
    const isDefault =
      selectedDepartment.value === 'COMPUTER_SCI' &&
      searchType.value === 'LEC' &&
      searchKeyword === '' &&
      page === 0;
    if (isDefault && initialContents.length > 0) return;

    getReviewsContent();
    setLoadState(false);
  }, [page, loadState]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialContents.length > 0) return;
    }
    setPage(0);
    setReviewContents([]);
    setHasMore(true);
    setLoadState(true);
  }, [selectedDepartment, searchKeyword, searchType]);

  return (
    <Suspense>
      <Header
        showBack
        tempBackOnClick="/main"
        title="수강 후기"
      />
      <DefaultBody hasHeader={1}>
        <div className="w-full">
          <div className="px-0 pt-[18px] overflow-hidden">
            <div
              id="scrollbar-hidden"
              className="flex w-full justify-start overflow-x-scroll gap-[7px]"
            >
              {DEPARTMENTS.map(({ label, value }: labelType) => (
                <SmRoundedBtn
                  key={`selectDepartment_${value}`}
                  text={label}
                  onClick={() => selectDepartmentHandler(label, value)}
                  status={value === selectedDepartment.value ? 1 : 0}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 w-full">
            <Input
              className="w-full"
              placeholder="과목명, 교수명 입력"
              value={query}
              onChange={e => onSearchKeywordChange(e.target.value)}
            />
            <div className="flex mt-4">
              {SEARCHTYPES.map(({ label, value }: searchTypesType) => (
                <UnderbarBtn
                  key={`searchType_${value}`}
                  text={label}
                  inverted={value === searchType.value}
                  className="font-semibold"
                  onClick={() => onSearchTypeChange({ label, value })}
                />
              ))}
            </div>
          </div>

          {reviewContents.length > 0 ? (
            reviewContents.map(
              (
                {
                  lectureNm,
                  _id,
                  starRating,
                  professor,
                  participants,
                  grade,
                  semesters,
                },
                idx
              ) => (
                <Subject
                  key={`subject_${_id}_${lectureNm}_${idx}`}
                  subjectName={lectureNm}
                  subjectCode={_id}
                  score={starRating}
                  professor={professor}
                  rateCnt={participants}
                  grade={grade}
                  semesters={semesters}
                />
              )
            )
          ) : (
            <p className="text-center mt-6 text-gray-500">데이터가 없습니다.</p>
          )}
          <ReviewBtn />
          {hasMore && (
            <div
              className="h-10"
              ref={lastElementRef}
            />
          )}
          {loading && <p className="text-center mt-4">Loading...</p>}
        </div>
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default CourseReviewPage;
