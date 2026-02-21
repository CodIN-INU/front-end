'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface BoardLinkCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function BoardLinkCard({
  href,
  icon,
  title,
  description,
}: BoardLinkCardProps) {
  return (
    <Link href={href} className="flex items-center py-[15px]">
      <div className="flex justify-center items-center w-[48px] aspect-square rounded-full shadow-05134">
        {icon}
      </div>
      <div className="ml-[15px]">
        <div className="font-bold text-[14px]">{title}</div>
        <div className="font-medium text-[10px] mt-[4px] opacity-[61%]">
          {description}
        </div>
      </div>
    </Link>
  );
}
