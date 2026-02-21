import { fetchClient } from '@/api/clients/fetchClient';
import { CourseReview } from '@/types/course';
import Heart from '@public/icons/heart.svg';
import { forwardRef, useState } from 'react';

interface Props {
  review: CourseReview;
}

const Review = forwardRef<HTMLDivElement, Props>(({ review }, ref) => {
  const { id, content, starRating, likeCount, semester, liked, likes } = review;

  const [tempFav, setTempFav] = useState(liked);
  const [tempFavNum, setTempFavNum] = useState(likes ?? 0);
  const [busy, setBusy] = useState(false);

  const LikeUpdate = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetchClient('/lectures/likes', {
        method: 'POST',
        body: JSON.stringify({
          likeType: 'REVIEW',
          likeTypeId: id.toString(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('좋아요 업데이트 성공:', res);
      setTempFav(prev => {
        const next = !prev;
        setTempFavNum(n => Math.max(0, n + (next ? 1 : -1)));
        return next;
      });
    } catch (error) {
      console.error('좋아요 업데이트 실패:', error);
      setTempFav(prev => {
        const rollback = !prev; // 방금 토글의 반대
        setTempFavNum(n => Math.max(0, n + (rollback ? 1 : -1)));
        return rollback;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      ref={ref}
      className="pt-[15px] pb-[21px] border-t border-[#D4D4D4]"
    >
      <div className="flex justify-between">
        <div className="text-Mm">{starRating.toFixed(1)}</div>
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={LikeUpdate}
        >
          <Heart
            width={19}
            height={19}
            stroke={!tempFav ? '#CDCDCD' : '#0D99FF'}
            fill={tempFav ? '#0D99FF' : 'none'}
          />
        </div>
      </div>
      <div className="mt-[9px] mb-[12px] text-Mr">{content}</div>
      <div className="flex justify-between items-center text-sr">
        <div className="text-sub">{semester} 학기 수강생</div>
        <div className="flex gap-[3px]">
          <div className="flex justify-center pt-[3px]">
            <Heart
              width={14}
              height={14}
              // stroke="#D2D5D9"
              fill="#D2D5D9"
            />
          </div>
          <div className="text-sub">{tempFavNum}</div>
        </div>
      </div>
    </div>
  );
});

export default Review;
