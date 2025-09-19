'use client';

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
dayjs.locale('en');

import LeftArrow from '@public/icons/arrow/arrow_left.svg';
import RightArrow from '@public/icons/arrow/arrow_right.svg';
import Calendar from '@public/icons/calendar.svg';
import ShadowBox from '@/components/common/shadowBox';
import CloseIcon from '@public/icons/button/x.svg';
import { fetchClient } from '@/api/clients/fetchClient';
import clsx from 'clsx';
import { Tag } from '@/interfaces/partners';

export default function DateCalendar() {
  // 연도 변환 모달
  const [showYearModal, setShowYearModal] = useState(false);

  // 현재 날짜
  const currentDate = dayjs();
  const currentYear = currentDate.year();
  const pastYear = currentDate.subtract(200, 'year').year();

  // 연도 목록
  const years: string[] = [];
  for (let year = currentYear; year >= pastYear; year--)
    years.push(String(year));

  // 요일
  const dayOfTheWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // 타입
  interface CalendarData {
    date: string;
    totalCont: number;
    items: Array<{
      eventId: string;
      content: string;
      department: Tag | 'OTHERS';
    }>;
  }

  interface DateWithStatus {
    date: dayjs.Dayjs;
    status: string[];
  }

  // 상태
  const [today, setToday] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<
    [string, number, dayjs.Dayjs] | null
  >(null);
  const [calendarData_fetched, setCalendarData] = useState<CalendarData[]>([]);

  // 달 정보
  const daysInMonth = today.daysInMonth();
  const firstDayOfMonth = dayjs(today).startOf('month').locale('en');

  // 날짜 배열
  const dates: DateWithStatus[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs(firstDayOfMonth).add(i - 1, 'day');
    dates.push({ date, status: ['point'] });
  }

  // 앞쪽 공백(0~6)
  const emptyDates = new Array(firstDayOfMonth.day()).fill(null);
  const calenderData: Array<null | DateWithStatus> = [...emptyDates, ...dates];

  // 네비게이션
  const onClickPastMonth = () => setToday(dayjs(today).subtract(1, 'month'));
  const onClickNextMonth = () => setToday(dayjs(today).add(1, 'month'));
  const onClickResetBtn = () => setToday(dayjs());

  // 연도 변경
  const onClickChangeYear = (year: string) => {
    setToday(dayjs(today).set('year', Number(year)));
    setShowYearModal(v => !v);
  };

  // 날짜 선택(0-based 인덱스 통일)
  const onClickChangeDate = (date: DateWithStatus, dayIndex0: number) => {
    setSelectedDate([date.date.format('YYYY-MM-DD'), dayIndex0, date.date]);
  };

  // 연도 모달 토글/닫기
  const showYearModalBtn = () => setShowYearModal(v => !v);
  const showDateCalendarModalBtn = () => setShowYearModal(false);

  // 데이터 fetch
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await fetchClient(
          `/calendar/month?year=${today.year()}&month=${today.month() + 1}`
        );
        if (response.success) {
          const data = response.data.days as CalendarData[];
          setCalendarData(data);
        } else {
          console.error('Failed to fetch calendar data:', response.message);
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };
    fetchCalendarData();
  }, [today]);

  // 날짜 문자열 → items 매핑 (인덱스 불일치 방지)
  const itemsByIso = useMemo(() => {
    const map = new Map<string, CalendarData['items']>();
    for (const d of calendarData_fetched ?? []) {
      const iso = dayjs(d?.date).format('YYYY-MM-DD');
      map.set(iso, Array.isArray(d?.items) ? d.items : []);
    }
    return map;
  }, [calendarData_fetched]);

  // 문서 클릭: 달력 바깥 클릭 시 선택 해제
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const el = e.target as HTMLElement | null;
      if (el && el.closest('[data-calendar-day]')) return;
      setSelectedDate(null);
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <ShadowBox>
      {/* Date Calendar */}
      <div className="z-[200]">
        <div className="pb-[16px]">
          {/* 선택된 날짜 툴팁: 날짜 문자열 매핑으로 표시 */}
          {selectedDate &&
            (itemsByIso.get(selectedDate[0])?.length ?? 0) > 0 && (
              <div className="absolute w-max text-[10px] top-[60px] left-[50%] translate-x-[-50%] rounded-[10px] backdrop-blur-[2px] bg-[#111111A3] text-white pt-[9px] pb-[13px] px-[13px] z-[200]">
                <div className="ml-[13px] font-normal">
                  {selectedDate[2].format('MM.DD')}
                </div>
                {(itemsByIso.get(selectedDate[0]) ?? []).map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center mt-[2px]">
                      <div
                        className={clsx(
                          'h-[6px] aspect-square rounded-full',
                          item.department === 'COMPUTER_SCI'
                            ? 'bg-main'
                            : item.department === 'EMBEDDED'
                            ? 'bg-[#87B9BA]'
                            : item.department === 'INFO_COMM'
                            ? 'bg-[#FE908A]'
                            : item.department === 'OTHERS'
                            ? 'bg-[#FBE08D]'
                            : 'bg-main'
                        )}
                      />
                      <span className="ml-[7px] leading-[14px]">
                        {item.content}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* 헤더 */}
          <header>
            <div className="relative flex justify-between pt-[18px] pb-[15px] border-b border-[#D4D4D4] p-[9px]">
              <div className="left-4">
                <div onClick={onClickPastMonth}>
                  <LeftArrow />
                </div>
              </div>

              <div
                onClick={showYearModalBtn}
                className="flex items-center cursor-pointer"
              >
                <Calendar />
                <span className="ml-[7px] text-[14px] text-active font-bold text-center leading-[15px]">
                  {today.format('MMMM YYYY')}
                </span>
              </div>

              <div className="right-4">
                <div onClick={onClickNextMonth}>
                  <RightArrow />
                </div>
              </div>

              {/* 연도 변경 모달 */}
              {showYearModal && (
                <section className="absolute top-[55px] left-0 z-[201] bg-[#fff] border-[1px] w-[330px] h-[280px] p-6 rounded-[15px]">
                  <ul
                    id="scrollbar-hidden"
                    className="w-full h-[200px] flex flex-row flex-wrap overflow-y-scroll"
                  >
                    {years.map((year, index) => (
                      <li
                        key={index}
                        onClick={() => onClickChangeYear(year)}
                        className={`w-[25%] h-[30px] flex flex-row justify-center items-center text-lg text-gray-600 cursor-pointer
                        ${
                          year === today.format('YYYY')
                            ? 'bg-black text-white'
                            : 'hover:font-bold hover:bg-gray-200 hover:text-black '
                        }`}
                      >
                        {year}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="flex flex-row justify-end pt-2"
                    onClick={showYearModalBtn}
                  >
                    <CloseIcon />
                  </div>
                </section>
              )}
            </div>

            {/* 요일 */}
            <ul className="flex flex-row justify-around px-[3.5px] pt-[17px] pb-[4px] text-[12px] font-bold">
              {dayOfTheWeek.map((el, index) => (
                <li
                  key={index}
                  className={`cursor-default w-[14.28%] text-center ${
                    el === 'SUN'
                      ? 'text-[#FE908A]'
                      : el === 'SAT'
                      ? 'text-active'
                      : 'text-sub'
                  }`}
                >
                  {el}
                </li>
              ))}
            </ul>
          </header>

          {/* 날짜 표시 */}
          <main className="px-[3.5px]">
            <ul className="flex flex-row flex-wrap">
              {calenderData.map((date, index) => (
                <li
                  key={index}
                  className="w-[14.28%] mt-[11px]"
                >
                  {date !== null && (
                    <div className="relative flex flex-col items-center">
                      <div
                        data-calendar-day
                        onClick={() =>
                          // ✅ 0-based 인덱스 유지 ( +1 제거 )
                          onClickChangeDate(date, index - emptyDates.length)
                        }
                        className={clsx(
                          'cursor-pointer flex justify-center items-center text-[10px] font-bold w-[25px] aspect-square rounded-full',
                          date.date.format('YYYY-MM-DD') ===
                            dayjs().format('YYYY-MM-DD')
                            ? 'bg-main !text-white'
                            : 'bg-sub hover:bg-gray',
                          selectedDate?.[0] ===
                            date.date.format('YYYY-MM-DD') &&
                            'border-[2px] border-[#AEAEAE] bg-[#0D99FF] text-white',
                          date.date.day() === 0
                            ? 'text-[#FE908A]'
                            : date.date.day() === 6
                            ? 'text-active'
                            : 'text-sub'
                        )}
                      >
                        {date.date.format('D')}
                      </div>

                      {/* 하단 점 표시: 날짜 문자열 매핑으로 렌더 */}
                      <div className="flex mt-[5px] h-[6px] gap-[3px]">
                        {(() => {
                          const iso = date.date.format('YYYY-MM-DD');
                          const items = itemsByIso.get(iso) ?? [];
                          return items.length > 0
                            ? items.map((item, i) => (
                                <div
                                  key={i}
                                  className={clsx(
                                    'h-[6px] aspect-square rounded-full',
                                    item.department === 'COMPUTER_SCI'
                                      ? 'bg-main'
                                      : item.department === 'EMBEDDED'
                                      ? 'bg-[#87B9BA]'
                                      : item.department === 'INFO_COMM'
                                      ? 'bg-[#FE908A]'
                                      : item.department === 'OTHERS'
                                      ? 'bg-[#FBE08D]'
                                      : 'bg-main'
                                  )}
                                />
                              ))
                            : null;
                        })()}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </main>

          {/* 모달 하단 (주석 유지)
          <section className="flex flex-row justify-between items-center px-2">
            <button type="button" onClick={onClickResetBtn} className="text-blue-500 hover:underline">
              초기화
            </button>
            <BlackBtn type={'button'} onClick={showDateCalendarModalBtn} px={'4'} py={'2'} textSize={'sm'} text={'닫기'} />
          </section>
          */}
        </div>
      </div>

      {/* DateCalendar 모달 바깥 부분 */}
      <div
        className="fixed top-0 left-0 w-full h-full z-[199]"
        style={{ display: showYearModal ? 'block' : 'none' }}
        onClick={showDateCalendarModalBtn}
      ></div>
    </ShadowBox>
  );
}
