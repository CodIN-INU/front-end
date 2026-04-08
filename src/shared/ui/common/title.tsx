'use client';

import clsx from 'clsx';

export default function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-[16px] font-bold', className)}>
      <span className="relative before:absolute before:w-[6px] before:h-[6px] before:rounded-full before:bg-[#0D99FF] before:-right-2">
        {children}
      </span>
    </div>
  );
}

