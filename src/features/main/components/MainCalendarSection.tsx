'use client';

import DateCalendar from '@/components/calendar/DateCalendar';

const MainCalendarSection = () => {
  return (
    <>
      <div className="font-bold text-[16px] mb-[11px]">인천대학교 캘린더</div>
      <DateCalendar />
    </>
  );
};

export default MainCalendarSection;

