/**
 * 메인 페이지 로딩 시 즉시 표시되는 정적 스켈레톤
 * - 서버 fetch(getTopPosts, getRoomStatus) 대기 중 LCP를 앞당김
 * - 클라이언트 JS 없이 HTML만으로 렌더되어 빠르게 paint됨
 */
export default function MainLoading() {
  return (
    <div className="bg-white w-full flex flex-col animate-pulse">
      {/* 캘린더 영역 스켈레톤 */}
      <div className="font-bold text-[16px] mb-[11px] h-5 w-[200px] rounded bg-[#E5E5E5]" />
      <div className="rounded-[12px] bg-[#F5F5F5] p-4">
        <div className="flex justify-between mb-4">
          <div className="h-4 w-24 rounded bg-[#E5E5E5]" />
          <div className="h-4 w-16 rounded bg-[#E5E5E5]" />
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-[#E5E5E5]" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-full bg-[#E5E5E5]" />
          ))}
        </div>
      </div>

      {/* 강의실 스켈레톤 */}
      <div className="mt-[34px] rounded-[12px] bg-[#F5F5F5]">
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

      {/* 랭킹 스켈레톤 */}
      <section className="mt-[48px]">
        <div className="h-6 w-[120px] rounded bg-[#E5E5E5] mb-[26px]" />
        <div className="flex flex-col gap-[27px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2 p-2">
              <div className="h-4 w-16 rounded bg-[#E5E5E5]" />
              <div className="h-5 w-full max-w-[280px] rounded bg-[#E5E5E5]" />
              <div className="h-3 w-full rounded bg-[#E5E5E5]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
