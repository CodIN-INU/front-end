function PercentBox({
  percent,
  text,
  top,
}: {
  percent: number;
  text: string;
  top: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-[4px]"
      style={{
        color: top ? '#0D99FF' : '#CDCDCD',
      }}
    >
      <div className="text-[10px] font-bold p-[1.5px_7px]">{percent}%</div>
      <div className="relative w-[10.7603px] h-[60px] bg-[#CDCDCD] rounded-full">
        <div
          className="rounded-full"
          style={{
            height: `${percent}%`,
            backgroundColor: top ? '#0D99FF' : '#CDCDCD',
          }}
        ></div>
      </div>
      <div className="text-[10px] font-medium">{text}</div>
    </div>
  );
}

export default function PercentBoxWrapper({
  emotion,
}: {
  emotion: { hard: number; ok: number; best: number };
}) {
  const { hard, ok, best } = emotion;
  const maxValue = Math.max(hard, ok, best);

  return (
    <div className="flex gap-[16px] py-[5px]">
      <PercentBox
        percent={emotion.hard}
        text="힘들어요"
        top={hard === maxValue && hard !== 0}
      />
      <PercentBox
        percent={emotion.ok}
        text="괜찮아요"
        top={ok === maxValue && ok !== 0}
      />
      <PercentBox
        percent={emotion.best}
        text="최고예요"
        top={best === maxValue && best !== 0}
      />
    </div>
  );
}
