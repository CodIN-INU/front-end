import clsx from 'clsx';

export default function PageBar({
  value,
  count,
}: {
  value: number;
  count: number;
}) {
  return (
    <div className="flex gap-[8px]">
      {Array.from({ length: count }, (_, i) => i + 1).map(num => (
        <Circle
          key={num}
          v={value}
          num={num}
        />
      ))}
    </div>
  );
}

function Circle({ v, num }: { v: number; num: number }) {
  return (
    <div
      className={clsx(
        'h-[6px] rounded-full transition-all',
        v == num ? 'w-[11px] bg-main' : 'w-[6px] bg-[#DBDBDB]'
      )}
    />
  );
}
