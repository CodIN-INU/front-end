'use client';

import { useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import Heart from '@public/icons/heart.svg';

interface ReviewCommentProps {
  _id: string;
  starRating: number;
  content: string;
  likes: number;
  isLiked: boolean;
  semester: string;
  refetch: () => void;
}

export function ReviewComment({
  _id,
  starRating,
  content,
  likes,
  isLiked,
  semester,
  refetch,
}: ReviewCommentProps) {
  const [tempFav, setTempFav] = useState(isLiked);
  const [tempFavNum, setTempFavNum] = useState(likes);
  const [busy, setBusy] = useState(false);

  const handleLike = async () => {
    if (busy) return;
    setBusy(true);

    try {
      await fetchClient('/lectures/likes', {
        method: 'POST',
        body: JSON.stringify({
          likeType: 'REVIEW',
          likeTypeId: _id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTempFav(prev => {
        const next = !prev;
        setTempFavNum(n => Math.max(0, n + (next ? 1 : -1)));
        return next;
      });
      refetch();
    } catch (error) {
      console.error('좋아요 업데이트 실패:', error);
      setTempFav(prev => {
        const rollback = !prev;
        setTempFavNum(n => Math.max(0, n + (rollback ? 1 : -1)));
        return rollback;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-[15px] pb-[21px] border-t border-[#D4D4D4]">
      <div className="flex justify-between">
        <div className="text-Mm">{Number(starRating).toFixed(1)}</div>
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={handleLike}
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
              fill="#D2D5D9"
            />
          </div>
          <div className="text-sub">{tempFavNum}</div>
        </div>
      </div>
    </div>
  );
}
