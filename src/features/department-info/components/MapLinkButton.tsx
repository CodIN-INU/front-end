"use client";

export default function MapLinkButton() {
  const handleMapLink = () => {
    alert("지도 링크로 이동합니다.");
  };

  return (
    <button
      className="text-gray-600 hover:text-gray-900 flex items-center"
      aria-label="뒤로가기"
      // onClick={handleMapLink}
    >
      <div className="w-[32px] h-[32px] flex items-center justify-center">
        <img src="/icons/map_link.svg" alt="맵 링크" />
      </div>
    </button>
  );
}
