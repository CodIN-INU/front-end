import Link from "next/link";
import { Tags, OtherTag } from '@/components/info/partner/tag';
import React, { useState } from "react";
import type { IPartners } from '@/interfaces/partners';

// 카드 컴포넌트
export const PartnerLinkCard: React.FC<{ partner: IPartners }> = ({ partner }) => {

  const cardShadow = "shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)]";

  return (
    <Link
      href={`/info/department-info/m/${partner.id}`}
      aria-label={`${partner.name} 상세보기`}
    >
      <div className={`block aspect-[170/243] w-full flex-1 rounded-[15px] cursor-pointer ${cardShadow}`}>
        <div className="flex flex-col w-full h-full items-center justify-center">
          {/* 이미지 */}
          <img
            src={partner.mainImg || '/images/partners/default.png'}
            alt={partner.name}
            className="flex-[170] w-full overflow-hidden rounded-t-[15px] object-cover"
            loading="lazy"
          />
          {/* 이름 & 태그 */}
          <div className="flex-[73] flex flex-col items-start px-[11px] py-[14px] justify-center w-full relative">
            {/* 이름 */}
            <p className="text-center text-[12px] font-bold mb-[7px] multiline-ellipsis">
              {partner.name}
            </p>
            {/* 태그 */}
            <div
              id="scrollbar-hidden"
              className="flex w-full h-[22px] gap-[3px] overflow-x-scroll"
            >
              {partner.tags.map((tag, idx) => (
                <Tags key={idx} tag={tag} />
              ))}
            </div>
            {/* 학과 제휴 */}
            <div className="absolute -top-[12.5px] left-[8px] bg-white rounded-[20px] h-[25px] px-[12px] py-[4.5px] ">
              <p className="text-[#0D99FF] text-[10px] font-bold">
                학과제휴
              </p>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};