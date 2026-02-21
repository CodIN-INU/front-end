import clsx from 'clsx';

export function CourseTag({ tag }: { tag: string }) {
  return (
    <div className="min-w-fit px-[8px] py-[2px] bg-[#EBF0F7] text-[11px] text-[#808080] rounded-[20px]">
      {tag}
    </div>
  );
}

export function CourseTagDetail({
  tag,
  width,
}: {
  tag: string;
  width?: string;
}) {
  return (
    <div
      className={clsx(
        'px-[12px] py-[5px] bg-[#EBF0F7] text-[11px] text-[#808080] rounded-[20px]',
        width && `w-[${width}] text-center`
      )}
    >
      {tag}
    </div>
  );
}
