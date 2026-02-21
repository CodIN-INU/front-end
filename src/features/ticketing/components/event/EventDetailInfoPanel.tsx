'use client';

import type { TicketEvent } from '@/types/snackEvent';
import { convertToKoreanDate } from '@/lib/utils/convertToKoreanDate';

const CARD_CLASS =
  'flex flex-col w-full mb-[50px] bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px] text-black gap-y-1';

type TabType = 'info' | 'note';

interface EventDetailInfoPanelProps {
  eventData: TicketEvent;
  selectedTab: TabType;
}

/** 이벤트 상세 정보 / 유의사항 탭 패널 */
export function EventDetailInfoPanel({
  eventData,
  selectedTab,
}: EventDetailInfoPanelProps) {
  return (
    <div className={CARD_CLASS}>
      {selectedTab === 'info' && (
        <>
          <div className="font-bold text-[14px] mb-2">{eventData.eventTitle}</div>
          <div>
            <span className="font-semibold">일시:</span>{' '}
            {convertToKoreanDate(eventData.eventEndTime)}
          </div>
          <div>
            <span className="font-semibold">장소: </span> {eventData.locationInfo}
          </div>
          <div>
            <span className="font-semibold">대상:</span> {eventData.target}
          </div>
          <div>
            <span className="font-semibold">수량:</span> {eventData.quantity}
          </div>
          <div>
            <span className="font-semibold">티켓팅 시작 시간:</span>{' '}
            {convertToKoreanDate(eventData.eventTime)}
          </div>
          <div className="text-black/50 self-center mt-[18px]">
            {eventData.description}
          </div>
          <a
            href={eventData.promotionLink}
            className="text-[#0D99FF] mt-[18px] underline underline-offset-[3px]"
          >
            학생회 간식나눔 정보글 링크
          </a>
          <div className="self-end text-[#AEAEAE]">
            문의: {eventData.inquiryNumber}
          </div>
        </>
      )}

      {selectedTab === 'note' && (
        <>
          <div className="font-bold text-[13px]">구매 내용</div>
          <div>
            • <span className="text-[#0D99FF]">1인 1매</span>씩 구매 가능합니다.{' '}
            <br />
            • 반드시{' '}
            <span className="text-[#0D99FF]">본인 학생증·학번</span>으로
            구매해야 하며, 수령 시 학생증으로 본인 확인합니다.{' '}
            <span className="text-[#eb2e2e]">
              (학생증 미지참 시 수령 불가){' '}
            </span>
            <br />• 티켓의 정해진 수량으로, 소진 시 조기 마감됩니다.
          </div>
          <div className="font-bold text-[13px] mt-1">수령 내용</div>
          <div>
            • 티켓팅 성공 시 발급된{' '}
            <span className="text-[#0D99FF]">
              간식나눔 교환권과 학생증
            </span>
            을 지참해야 수령 가능합니다. <br />•{' '}
            <span className="text-[#0D99FF]">간식나눔 시작 후 30분</span> 미수령
            시 당일 티켓은 자동 취소되고 당장 배포됩니다.
          </div>
          <div className="font-bold text-[13px] mt-1">도용·거래 금지</div>
          <div>
            • 티켓은{' '}
            <span className="text-[#0D99FF]">도용, 매매, 거래가 금지</span>
            이며, 타인 명의 매매 및 구매는 모두 수령 불가 처리됩니다.
          </div>
          <div className="font-bold text-[13px] mt-1">취소 내용</div>
          <div>
            • 티켓은 마감시간까지 자유롭게 취소 가능합니다. <br />• 취소는{' '}
            <span className="text-[#0D99FF]">
              [마이페이지 → 간식나눔 → 내 티켓팅 내역]
            </span>
            에서 진행됩니다. <br />• 기재된 시간에 미수령 시 자동으로
            취소됩니다.
          </div>
          <div className="font-bold text-[13px] mt-1">문의</div>
          <div>
            • 서비스 이용 문의:{' '}
            <a
              href="https://www.instagram.com/codin_inu?igsh=bnZ0YmhjaWxtMXp4"
              className="underline text-[#0D99FF]"
            >
              CodIN 인스타그램
            </a>{' '}
            DM <br />• 간식나눔 관련 문의: 주최측 학생회
          </div>
          <div className="text-[#AEAEAE] text-center mt-2">
            문의 시 문의 내용에 고객님의 학과와 학번, 성함을 적어주시면
            <br /> 빠른 처리가 가능합니다.
          </div>
        </>
      )}
    </div>
  );
}
