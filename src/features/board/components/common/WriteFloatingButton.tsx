'use client';

import Link from 'next/link';

interface WriteFloatingButtonProps {
  href: string;
  ariaLabel?: string;
}

const WriteIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.80002 14.5999L8.00002 18.1999M3.20002 14.5999L15.0314 2.35533C16.3053 1.08143 18.3707 1.08143 19.6446 2.35533C20.9185 3.62923 20.9185 5.69463 19.6446 6.96853L7.40002 18.7999L1.40002 20.5999L3.20002 14.5999Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function WriteFloatingButton({
  href,
  ariaLabel = '글쓰기',
}: WriteFloatingButtonProps) {
  return (
    <div className="absolute right-[78px]">
      <Link
        href={href}
        className="fixed bottom-[108px] bg-main text-white rounded-full shadow-lg p-4 hover:bg-blue-600 transition duration-300"
        aria-label={ariaLabel}
      >
        <WriteIcon />
      </Link>
    </div>
  );
}
