'use client';

import { useParams } from 'next/navigation';
import { Suspense, useContext, useEffect, useState } from 'react';
import type { lectureInfoType, emotionType, reviewType } from '@/features/course-reviews/types';
import { BottomNav, DefaultBody, Header } from '@/shared/ui';
import { DepartmentReviewComponent } from '@/features/course-reviews/components/DepartmentReview';
import { useDepartmentRatingInfoContext } from '@/features/course-reviews/api/useDepartmentRatingInfoContext';
import { ReviewComment } from '@/features/course-reviews/components/ReviewComment';
import { useLectureReviewsContext } from '@/features/course-reviews/api/useLectureReviewsContext';
import { ReviewBtn } from '@/features/course-reviews/components/ReviewBtn';
import { ReviewContext } from '@/context/WriteReviewContext';
import type { LectureRatingInfo } from '@/server';
import type { ReviewComment as ReviewCommentType } from '@/server';

interface DepartmentReviewClientProps {
  initialLectureInfo?: LectureRatingInfo | null;
  initialReviewList?: ReviewCommentType[];
}

const DepartmentReviewClient = ({
  initialLectureInfo = null,
  initialReviewList = [],
}: DepartmentReviewClientProps) => {
  const { departmentCode } = useParams();

  const [lectureInfo, setLectureInfo] = useState<lectureInfoType | null>(
    initialLectureInfo
      ? {
          _id: initialLectureInfo._id,
          lectureNm: initialLectureInfo.lectureNm,
          professor: initialLectureInfo.professor,
          starRating: initialLectureInfo.starRating,
          participants: initialLectureInfo.participants,
          grade: initialLectureInfo.grade,
          semesters: initialLectureInfo.semesters,
        }
      : null
  );
  const [emotion, setEmotion] = useState<emotionType | null>(
    initialLectureInfo?.emotion ?? null
  );
  const [reviewList, setReviewList] = useState<reviewType[]>(
    initialReviewList.map((r) => ({
      _id: r._id,
      lectureId: '',
      userId: '',
      content: r.content,
      starRating: r.starRating,
      likeCount: r.likeCount,
      liked: r.liked,
      semester: r.semester,
    }))
  );
  const [refetch, setRefetch] = useState<boolean>(false);
  const context = useContext(ReviewContext);
  const data = context?.data ?? {
    departments: { label: '??ê³¼', value: '' },
    grade: { label: '??ë??', value: '' },
  };
  const setData = context?.setData ?? (() => {});

  const getDepartMentRateInfo = async () => {
    try {
      const response = await useDepartmentRatingInfoContext({
        departmentId: `${departmentCode}`,
      });
      const resData = response.data;
      setLectureInfo({
        _id: resData._id,
        lectureNm: resData.lectureNm,
        professor: resData.professor,
        starRating: resData.starRating,
        participants: resData.participants,
        grade: resData.grade,
        semesters: resData.semesters,
      });
      setEmotion(resData.emotion);
    } catch (error) {
      console.error('ê³¼ëª©ë³???ê¸° ì¡°í?? ?¤í?¨', error);
      alert('ê³¼ëª©ë³???ê¸° ì¡°í?? ?¤í?¨');
    }
  };

  const getReviewList = async () => {
    try {
      const response = await useLectureReviewsContext({
        lectureId: `${departmentCode}`,
      });
      const resData = response.data;
      setReviewList(resData.contents ?? []);
    } catch (error) {
      console.error('ê³¼ëª©ë³???ê¸° ì¡°í?? ?¤í?¨', error);
      alert('ê³¼ëª©ë³???ê¸° ì¡°í?? ?¤í?¨');
    }
  };

  useEffect(() => {
    if (!initialLectureInfo) {
      getDepartMentRateInfo();
      getReviewList();
    }
  }, []);

  useEffect(() => {
    if (lectureInfo) {
      setData({
        ...data,
        grade: {
          label: `${lectureInfo.grade}??ë??`,
          value: `${lectureInfo.grade}`,
        },
      });
    }
  }, [lectureInfo]);

  useEffect(() => {
    if (refetch) {
      getReviewList();
      setRefetch(false);
    }
  }, [refetch]);

  return (
    <Suspense>
      <Header title="ê³¼ëª© ë³???ê¸°" showBack />
      <DefaultBody headerPadding="compact">
        {lectureInfo && emotion && (
          <DepartmentReviewComponent
            subjectName={lectureInfo.lectureNm}
            professor={lectureInfo.professor}
            grade={lectureInfo.grade}
            semesters={lectureInfo.semesters}
            starRating={lectureInfo.starRating}
            score={emotion}
          />
        )}
        {reviewList.length > 0 &&
          reviewList.map(
            ({ _id, content, starRating, likeCount, liked, semester }, idx) => (
              <ReviewComment
                key={`${_id}_${idx}`}
                starRating={starRating}
                content={content}
                likes={likeCount}
                isLiked={liked}
                semester={semester}
                _id={_id}
                refetch={() => setRefetch(true)}
              />
            )
          )}
        <ReviewBtn />
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default DepartmentReviewClient;
