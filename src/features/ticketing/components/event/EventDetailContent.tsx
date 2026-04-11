'use client';

import type { TicketEvent } from '@/types/snackEvent';
import { EventDetailInfoPanel } from './EventDetailInfoPanel';
import type { User } from '@/shared/types/auth';
import { getDepartmentLabel } from '@/shared/utils/getDepartmentLabel';

type TabType = 'info' | 'note';

/** 이름 → 학과 → 학번 순으로 누락 항목만 나열 */
function getMissingProfileFieldsMessage(user: User): string {
  const labels: string[] = [];
  if (!user.name) labels.push('이름');
  if (!user.department) labels.push('학과');
  if (!user.studentId) labels.push('학번');
  return `${labels.join(', ')} 입력이 필요합니다.`;
}

function isProfileComplete(user: User): boolean {
  return Boolean(user.department && user.studentId && user.name);
}

interface EventDetailContentProps {
  eventData: TicketEvent;
  user: User;
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
  onShowUserInfoModal: () => void;
}

/** 이벤트 상세 본문: 이미지, 수량, 수령 정보 CTA, 상세/유의사항 탭 */
export function EventDetailContent({
  eventData,
  user,
  selectedTab,
  onTabChange,
  onShowUserInfoModal,
}: EventDetailContentProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4 flex justify-center">
        <img
          src={eventData.eventImageUrls || '/images/default.svg'}
          alt="간식 이미지"
        />
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-start font-semibold text-[18px]">
            잔여 수량
            <span className="text-[#0D99FF] ml-1 mt-[-10px]">•</span>
          </div>
          <div className="text-[#0D99FF] font-semibold text-[18px]">
            {eventData.currentQuantity}개
          </div>
        </div>
        <div className="text-[12px] text-black mt-1">
          실시간으로 업데이트 됩니다.
        </div>
      </div>

      <div className="w-full border-t border-[#D4D4D4]" />

      <div className="flex flex-col items-center">
        <div className="text-[13px] text-[#0D99FF] mt-2 text-center font-medium leading-[17px]">
          {isProfileComplete(user) ? (
            <>
              수령자 정보를 확인해주세요.
              <div className="text-[16px] text-black mt-2 text-center font-semibold leading-[17px]">
                {getDepartmentLabel(user.department!)} {user.studentId} {user.name}
              </div>
            </>
          ) : (
            <div className="text-[16px] text-black mt-2 text-center font-semibold leading-[17px]">
              {getMissingProfileFieldsMessage(user)}
            </div>
          )}
        </div>
        <button
          className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]"
          onClick={onShowUserInfoModal}
        >
          수령자 정보 수정
        </button>
      </div>

      <div className="w-full flex justify-end text-[11px] text-[#0D99FF] gap-3">
        <button
          className={`${selectedTab === 'note' ? 'text-[#AEAEAE]' : ''} underline underline-offset-[3px]`}
          onClick={() => onTabChange('info')}
        >
          상세정보
        </button>
        <button
          className={`${selectedTab === 'info' ? 'text-[#AEAEAE]' : ''} underline underline-offset-[3px]`}
          onClick={() => onTabChange('note')}
        >
          유의사항
        </button>
      </div>

      <EventDetailInfoPanel eventData={eventData} selectedTab={selectedTab} />
    </div>
  );
}
