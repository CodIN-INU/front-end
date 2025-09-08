import { CourseTag } from './tag';
import Link from 'next/link';
import Heart from '@public/icons/heart.svg';
import Rating from '@/components/info/rating';
import { Course } from '@/interfaces/course';
import { forwardRef, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import { Tag, tagsArray } from '@/interfaces/partners';

interface Props {
  fav: boolean;
  value: Course;
}

const tagMap: Record<Tag, string> = {
  COMPUTER_SCI: '컴퓨터공학과',
  EMBEDDED: '임베디드시스템공학과',
  INFO_COMM: '정보통신공학과',
  IT_COLLEGE: '정보대',
};

const CourseCard = forwardRef<HTMLDivElement, Props>(({ fav, value }, ref) => {
  const {
    id,
    title,
    professor,
    type,
    grade,
    credit,
    tags,
    department,
    starRating,
    likes,
  } = value;
  const [tempFav, setTempFav] = useState(fav);
  const [tempFavNum, setTempFavNum] = useState(likes ?? 0);
  const [busy, setBusy] = useState(false);

  const LikeUpdate = async () => {
    if (busy || !id) return;
    setBusy(true);

    try {
      const res = await fetchClient('/lectures/likes', {
        method: 'POST',
        body: JSON.stringify({
          likeType: 'LECTURE',
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
      className="relative flex items-center min-h-[230px] shadow-05134 rounded-[15px]"
    >
      <Link
        href={`/info/courses/${id}`}
        className="flex items-center aspect-square"
      >
        <div className="relative flex w-full px-[14px] py-[25px] justify-between items-start">
          <div>
            <div className="mb-[12px]">
              <div className="mb-[15px]">
                <p className="text-[11px] text-[#0D99FF]">{type}</p>
                <h3 className="text-[16px] font-bold overflow-ellipsis whitespace-nowrap w-[150px] overflow-hidden">
                  {title}
                </h3>
                <p className="text-[12px] text-sub">{professor}</p>
              </div>
              <div className="mt-[29px] mb-[8px] text-[12px]">
                <div className="text-sub text-sr">
                  {tagMap[department as Tag] ? tagMap[department] : department}
                </div>
                <div className="text-[12px] font-medium">
                  {grade}학년 {credit}학점
                </div>
              </div>
              <Rating score={starRating} />
            </div>
            <div
              id="scrollbar-hidden"
              className="flex gap-[4px] overflow-x-scroll"
            >
              {tags.slice(3).map((tag, index) => (
                <CourseTag
                  key={index}
                  tag={tag}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
      <div
        onClick={LikeUpdate}
        className="absolute top-[20px] right-[9px] p-[5px] flex gap-[3px] items-center cursor-pointer"
      >
        <Heart
          width={16}
          height={16}
          stroke={tempFav ? '#0D99FF' : '#CDCDCD'}
          fill={tempFav ? '#0D99FF' : 'none'}
        />
        <span
          className="text-[11px] h-[16px] leading-[1.45]"
          style={{
            color: tempFav ? '#0D99FF' : '#CDCDCD',
          }}
        >
          {tempFavNum}
        </span>
      </div>
    </div>
  );
});

export default CourseCard;
