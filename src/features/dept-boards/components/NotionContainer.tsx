export default function NotionContainer({
  title,
  content,
  nickname,
  time,
}: {
  title: string;
  content: string;
  nickname: string;
  time: string;
}) {
  return (
    <div className="flex justify-center items-center px-[16px]">
      <div className="relative px-[17.31px] py-[16px] w-full">
        <div className="font-bold text-[14px]">{title}</div>
        <div className="mt-[8px] mb-[22px] text-sr text-sub break-all line-clamp-3 overflow-ellipsis">
          {content}
        </div>
        <div className="absolute bottom-[10px] right-[17px] text-[#AEAEAE] text-[10px] font-medium text-right">
          {nickname} | {time}
        </div>
      </div>
    </div>
  );
}
