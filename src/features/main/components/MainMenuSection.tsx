'use client';

import Link from 'next/link';
import type { MainMenuItem } from '../types';

interface MainMenuSectionProps {
  items: MainMenuItem[];
}

const MainMenuSection = ({ items }: MainMenuSectionProps) => {
  return (
    <section className="mt-[32px] relative flex flex-col">
      <div className="flex justify-between gap-y-[24px]">
        {items.map(({ label, href, icon: Icon }, index) => (
          <Link
            href={href}
            key={index}
            className="flex flex-col justify-start items-center text-center text-Mm"
          >
            <div className="w-[61px] h-[61px] bg-white flex items-center justify-center rounded-full shadow-[0px_5px_13.3px_1px_rgba(212,212,212,0.59)]">
              <Icon />
            </div>
            <div className="flex justify-center items-center mt-[3px] w-[61px] h-[30px]">
              <span className="text-sr break-keep leading-[14px] text-[#AEAEAE]">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainMenuSection;

