'use client';
import Title from '@/components/common/title';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Review from '@/components/info/courses/review';
import { CourseDetail, exampleCourse } from '@/interfaces/course';
import { fetchClient } from '@/api/clients/fetchClient';
import Rating from '@/components/info/rating';
import { useParams } from 'next/navigation';
import PercentBoxWrapper from '@/components/info/courses/percentBox';
import type { CourseReview } from '@/interfaces/course';
import { CourseTagDetail } from '@/components/info/courses/tag';
import Lock from '@public/icons/Lock.svg';
import Arrow from '@public/icons/arrow.svg';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id;

  // const tags = [
  //   '프로그래밍',
  //   '알고리즘',
  //   '데이터베이스',
  //   '웹 개발',
  //   '인공지능',
  //   '빅데이터',
  //   'IoT',
  //   '블록체인',
  // ];
  // const preCourse = ['프로그래밍 기초', '자료구조', '운영체제'];

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<CourseDetail>(exampleCourse);
  const [reviews, setReviews] = useState<CourseReview[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const inFlight = useRef(false);
  const fetchedPages = useRef(new Set<number>());

  const fetchReviews = useCallback(
    async (p: number) => {
      if (!id) return;
      if (inFlight.current) return; // 진행 중이면 스킵
      if (fetchedPages.current.has(p)) return; // 이미 가져온 페이지면 스킵

      inFlight.current = true;
      try {
        const res = await fetchClient(`/lectures/reviews/${id}?page=${p}`);
        const data = res.data;
        console.log(data);
        const review: CourseReview[] = data.contents;

        // 혹시라도 서버가 중복을 섞거나 2중요청되서 중복된 리뷰가 오면 필터링
        setReviews(prev => {
          const ids = new Set(prev.map(r => r.id));
          const filtered = review.filter(r => !ids.has(r.id));
          return prev.concat(filtered);
        });

        setHasMore(data.nextPage !== -1);
        fetchedPages.current.add(p); // 이 페이지는 완료로 표시
      } catch (e) {
        console.error('Error fetching reviews:', e);
      } finally {
        inFlight.current = false;
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) {
      console.error('Query parameter "id" is missing');
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetchClient(`/lectures/${id}`);
        const data: CourseDetail = res.data;
        console.log(data);

        setCourse(data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasMore(true);
    fetchedPages.current.clear();
  }, [id]);

  useEffect(() => {
    fetchReviews(page);
  }, [page, fetchReviews]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node) return;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore && !inFlight.current) {
            setPage(p => p + 1);
          }
        },
        { rootMargin: '200px' }
      );

      observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <>
      <Header
        showBack
        title={course.title}
      />
      <DefaultBody hasHeader={1}>
        <div className="relative px-[35px] py-[28px] shadow-05134 rounded-[15px] mt-[13px]">
          <div className="flex flex-col text-[12px] gap-[4px]">
            <Bold>
              {course.college} &gt; {course.department}
            </Bold>
            <Bold>
              {course.type} / {course.evaluation}
            </Bold>
            <Bold>{course.lectureType}</Bold>
            <BoldWithText text="교수명">{course.professor}</BoldWithText>
            <BoldWithText text="학년">{course.grade}학년</BoldWithText>
            <BoldWithText text="학점">{course.credit}학점</BoldWithText>
            {course.schedule.length > 0 && (
              <div className="flex">
                <Bold>시간 :&nbsp;</Bold>
                {/* 알고리즘 필요 */}
                <div>
                  {course.schedule.map((time, index) => (
                    <p
                      key={index}
                      className="text-sr"
                    >{`${time.day} ${time.start} ~ ${time.end}`}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* <div className="absolute bottom-[13px] right-[20px] p-[3px] border-b text-[11px] text-active border-b-[#0D99FF] cursor-pointer">
            <span>강의 계획서 자세히 보기</span>
          </div> */}
        </div>
        {course.preCourse !== null && course.preCourse.length > 0 && (
          <div className="mt-[33px]">
            <Title>이 과목은 선수과목이 있어요</Title>
            <div className="flex justify-center mt-[18px] items-center gap-[4px]">
              <div className="flex flex-col gap-[5px] items-center">
                {course.preCourse.length === 1 ? (
                  <div className="flex justify-center items-center w-[81px] h-[81px] p-[8px] bg-sub rounded-full">
                    <span className="text-sub text-[11px] whitespace-normal break-keep text-center">
                      {course.preCourse[0]}
                    </span>
                  </div>
                ) : (
                  course.preCourse.map((course, index) => (
                    <div
                      key={index}
                      className="flex text-sub items-center justify-center text-center w-[81px] bg-sub rounded-full p-[5px]"
                    >
                      <span className="text-sub text-[11px] whitespace-normal break-keep text-center">
                        {course}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <Arrow />
              <div className="flex items-center justify-center w-[85px] h-[85px] bg-[#B4E0FF] rounded-full">
                <div className="flex items-center p-[5px] justify-center w-[75px] h-[75px] bg-main rounded-full">
                  <div className="text-white text-[11px] whitespace-normal break-keep text-center">
                    {course.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {course.tags.length > 0 && (
          <div className="mt-[33px]">
            <Title>다음 키워드와 연관있어요</Title>
            <div className="relative h-[130px] px-[23px] py-[15px] mt-[15px] shadow-05134 rounded-[15px] z-50">
              <div className="flex items-start gap-x-[10px] gap-y-[18px] flex-wrap">
                <>
                  {course.tags.map((tag, i) => (
                    <CourseTagDetail
                      key={i}
                      tag={tag}
                    />
                  ))}
                  {!course.openKeyword && (
                    <div
                      className="absolute top-[48px] left-0 w-full h-[calc(100%-48px)] backdrop-blur-[6.4px] rounded-[15px] z-10
                    flex flex-col items-center justify-center"
                    >
                      <div>
                        <Lock />
                      </div>
                      <div className="text-active font-bold text-[12px]">
                        수강후기 3개를 달면 키워드를 모두 확인할 수 있어요
                      </div>
                      <div className="border-b border-b-[#808080]">
                        <span className="px-[4px] py-[3px] text-[11px] text-[#808080]">
                          수강 후기 남기러 가기
                        </span>
                      </div>
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
        )}
        <div className="mt-[23px]">
          <Title>수강 후기</Title>
          <div>
            <div className="relative flex justify-evenly h-fit mb-[22px]">
              <div className="flex flex-col justify-center items-center py-[13px]">
                <div className="text-[28px] font-[900] mb-[2px]">
                  {course.starRating.toPrecision(2)}
                </div>
                <Rating score={course.starRating} />
                <div className="text-[#CDCDCD] font-medium text-[10px] mt-[13px]">{`${reviews.length} 명의 학생이 평가했어요`}</div>
              </div>
              <div className="border-l border-[#D4D4D4] self-stretch" />
              <div className="flex gap-[16px] py-[5px]">
                <PercentBoxWrapper emotion={course.emotion} />
              </div>
            </div>
            <div>
              {reviews.length > 0 ? (
                reviews.map((review, i) => {
                  const isLast = i === reviews.length - 1;
                  return (
                    <Review
                      key={review.id}
                      ref={isLast ? sentinelRef : null}
                      review={review}
                    />
                  );
                })
              ) : (
                <div className="text-sub text-center pt-[15px] pb-[21px] border-t border-[#D4D4D4]">
                  등록된 수강후기가 없어요
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute right-[78px]">
          <Link
            href={`/info/course-reviews/write-review`}
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
      </DefaultBody>
    </>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <span className="font-bold">{children}</span>;
}
function BoldWithText({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <Bold>
      <span>{text} : </span>
      <span className="text-sr">{children}</span>
    </Bold>
  );
}
