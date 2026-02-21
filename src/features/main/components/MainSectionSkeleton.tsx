'use client';

/**
 * 강의실/랭킹 섹션 로딩 시 레이아웃 유지를 위한 스켈레톤
 */
const MainSectionSkeleton = ({
  variant = 'room',
}: {
  variant?: 'room' | 'ranking';
}) => {
  if (variant === 'room') {
    return (
      <div className="mt-[34px] rounded-[12px] bg-[#F5F5F5] animate-pulse">
        <div className="flex justify-between pl-[14px] pr-[5px] pt-[23px] pb-[18px]">
          <div className="h-4 w-[180px] rounded bg-[#E5E5E5]" />
          <div className="h-3 w-[60px] rounded bg-[#E5E5E5]" />
        </div>
        <div className="px-[14px] pb-[22px] space-y-3">
          <div className="h-[52px] w-full rounded bg-[#E5E5E5]" />
          <div className="h-[52px] w-full rounded bg-[#E5E5E5]" />
        </div>
        <div className="flex justify-center py-[22px]">
          <div className="h-2 w-24 rounded-full bg-[#E5E5E5]" />
        </div>
      </div>
    );
  }

  return (
    <section className="mt-[48px]">
      <div className="h-6 w-[120px] rounded bg-[#E5E5E5] animate-pulse mb-[26px]" />
      <div className="flex flex-col gap-[27px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2 bg-white p-2">
            <div className="h-4 w-16 rounded bg-[#E5E5E5]" />
            <div className="h-5 w-full max-w-[280px] rounded bg-[#E5E5E5]" />
            <div className="h-3 w-full rounded bg-[#E5E5E5]" />
            <div className="flex justify-between mt-2">
              <div className="flex gap-2">
                <div className="h-3 w-8 rounded bg-[#E5E5E5]" />
                <div className="h-3 w-8 rounded bg-[#E5E5E5]" />
                <div className="h-3 w-8 rounded bg-[#E5E5E5]" />
              </div>
              <div className="h-3 w-20 rounded bg-[#E5E5E5]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainSectionSkeleton;
