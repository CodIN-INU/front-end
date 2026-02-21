/**
 * 강의실 현황 진입 페이지 (층 선택 유도)
 * SSR 가능한 단순 정적 UI
 */
export default function RoomStatusPage() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <h1 className="text-2xl font-bold text-[#b3b7bd]">
        Please Select a floor
      </h1>
    </div>
  );
}
