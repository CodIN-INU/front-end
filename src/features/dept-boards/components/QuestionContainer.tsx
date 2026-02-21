export default function QuestionContainer({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="flex justify-center items-center px-[16px]">
      <div className="relative px-[17.31px] py-[16px] min-h-[90px] w-full">
        <div className="font-bold text-[14px] text-active">Q. {question}</div>
        <div className="mt-[8px] text-[12px] font-medium text-sub break-all overflow-ellipsis">
          A. {answer}
        </div>
      </div>
    </div>
  );
}
