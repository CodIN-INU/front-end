import { ComponentProps, Dispatch, SetStateAction } from 'react';

type RateBarType = {
  score: number;
  barWidth: number;
  clickable?: boolean;
  height?: number;
  clickFn?: Dispatch<SetStateAction<number>>;
} & ComponentProps<"div">;

const generateBars = (coloredBarCnt: number, barWidth: number, height: number) => {
  const bars = [];
  for (let i = 0; i < 20; i++) {
    if (coloredBarCnt > i) {
      bars.push(
        <div
          key={`coloredBar_${i}`}
          className={`h-${height} mr-[0.15rem] bg-[#0D99FF]`}
          style={{ width: `${barWidth}rem` }}
        />
      );
    } else {
      bars.push(
        <div
          key={`grayBar_${i}`}
          className={`h-${height} mr-[0.15rem] bg-[#EBF0F7] group-hover:bg-white`}
          style={{ width: `${barWidth}rem` }}
        />
      );
    }
  }
  return bars;
};

const generateClickableBars = (coloredBarCnt: number, barWidth: number, clickFn: Dispatch<SetStateAction<number>>) => {
  const bars = [];
  for (let i = 0; i < 20; i++) {
    if (coloredBarCnt > i) {
      bars.push(
        <div
          key={`coloredBar_${i}`}
          className={`h-7 mr-[0.15rem] bg-[#0D99FF]`}
          style={{ width: `${barWidth}rem` }}
          onClick={() => clickFn((i + 1) * 0.25) }
        />
      );
    } else {
      bars.push(
        <div
          key={`grayBar_${i}`}
          className={`h-7 mr-[0.15rem] bg-[#EBF0F7]`}
          style={{ width: `${barWidth}rem` }}
          onClick={() => clickFn((i + 1) * 0.25) }
        />
      );
    }
  }
  return bars;
};

const RateBar = ({
  score,
  barWidth,
  clickable = false,
  clickFn,
  className = "",
  height = 7,
}: RateBarType) => {
  const coloredBarCnt = score / 0.25;
  const barAry = clickable
    ? generateClickableBars(coloredBarCnt, barWidth, clickFn)
    : generateBars(coloredBarCnt, barWidth, height);
  return (
    <div className={`flex content-center ${className}`}>
      {barAry.map((bar) => {
        return bar;
      })}
    </div>
  );
};

export { RateBar };