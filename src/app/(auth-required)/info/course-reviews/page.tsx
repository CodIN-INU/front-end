"use client";

import SmRoundedBtn from "@/components/buttons/smRoundedBtn";
import { DEPARTMENTS, SEARCHTYPES } from "./constants";
import { labelType, reviewContentType, searchTypesType } from "./types";
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/input/Input";
import { debounce } from "lodash";
import { UnderbarBtn } from "@/components/buttons/underbarBtn";
import { Subject } from "@/components/Review/Subject";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { useReviewsContext } from "@/api/review/getReviewsContext";
import { ReviewBtn } from '@/components/Review/ReviewBtn';
import { ReviewContext } from '@/context/WriteReviewContext';

const CourseReviewPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({
    label: "컴공",
    value: "COMPUTER_SCI",
  });
  const [searchType, setSearchType] = useState<searchTypesType>({
    label: "과목명",
    value: "LEC",
  });

  const [query, setQuery] = useState<string>(""); // 입력값 즉시 반영
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 디바운스된 값
  const [reviewContents, setReviewContents] = useState<reviewContentType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 존재 여부
  const [loadState, setLoadState] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const { data, setData } = useContext(ReviewContext);

  // 과목 선택 핸들러
  const selectDepartmentHandler = (
    selectedLabel: string,
    selectedValue: string
  ) => {
    setSelectedDepartment({ label: selectedLabel, value: selectedValue });
    setData({
      ...data,
      departments: { label: selectedLabel, value: selectedValue },
    });
    setPage(0); // 페이지 초기화
    setReviewContents([]); // 기존 데이터 초기화
    setHasMore(true); // 데이터 존재 여부 초기화
  };

  // 검색 유형 변경 핸들러
  const onSearchTypeChange = ({ label, value }: searchTypesType) => {
    setSearchType({ label, value });
    setPage(0);
    setReviewContents([]);
    setHasMore(true);
  };

  // 디바운스된 검색 함수
  const debouncedSearch = useMemo(
    () =>
      debounce((keyword) => {
        setSearchKeyword(keyword);
        setPage(0);
        setReviewContents([]);
        setHasMore(true);
      }, 200),
    []
  );

  // 입력 변경 핸들러
  const onSearchKeywordChange = (keyword: string) => {
    setQuery(keyword);
    debouncedSearch(keyword);
  };

  // 리뷰 데이터 가져오기
  const getReviewsContent = async () => {
    if (loading || !hasMore) return; // 로딩 중이거나 데이터가 없으면 요청 안 함

    setLoading(true);
    try {
      const data = await useReviewsContext({
        department: selectedDepartment.value,
        keyword: searchKeyword,
        option: searchType.value,
        page: page,
      });

      setReviewContents((prev) => [...prev, ...data.data.contents]);
      setHasMore(data.data.contents.length > 0); // 추가 데이터가 없으면 false 설정
    } catch (err) {
      alert("데이터를 불러오지 못했습니다");
      setHasMore(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 마지막 요소 감지 (IntersectionObserver)
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setData({
      departments: selectedDepartment,
      grade: { label: '', value: '' }
    });
  }, [])

  // `page` 상태가 변경될 때마다 `getReviewsContent` 호출
  useEffect(() => {
    getReviewsContent();
    setLoadState(false);
  }, [page, loadState]);

  // `selectedDepartment`, `searchKeyword`, `searchType`가 변경될 때 `page` 초기화
  useEffect(() => {
    setPage(0);
    setReviewContents([]);
    setHasMore(true);
    setLoadState(true);
  }, [selectedDepartment, searchKeyword, searchType]);

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>수강 후기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="w-full">
          {/* 학과 선택 버튼 */}
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

          {/* 검색 입력 */}
          <div className="mt-4 w-full">
            <Input
              className="w-full"
              placeholder="과목명, 교수명 입력"
              value={query}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
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

          {/* 리뷰 리스트 */}
          {reviewContents.length > 0 ? (
            reviewContents.map(
              (
                { lectureNm, _id, starRating, professor, participants, grade, semesters },
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
            <p className="text-center mt-6 text-gray-500">
              데이터가 없습니다.
            </p>
          )}
          <ReviewBtn />
          {/* 마지막 요소 감지 */}
          {hasMore && <div className="h-10" ref={lastElementRef}></div>}

          {/* 로딩 표시 */}
          {loading && <p className="text-center mt-4">Loading...</p>}
        </div>
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default CourseReviewPage;
