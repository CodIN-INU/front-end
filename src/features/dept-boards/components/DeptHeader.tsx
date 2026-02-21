import Right from '@public/icons/arrow/arrow_right.svg';
import Title from '@/components/common/title';
import Link from 'next/link';

export default function DeptHeader({
  SVG,
  title,
  href,
}: {
  SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-center pr-[7px] pt-[16px] pl-[16px]">
      <div className="flex justify-center items-center shadow-05134 rounded-full w-[61px] aspect-square overflow-visible">
        <SVG />
      </div>
      <div className="flex items-center w-full pt-[11px] ml-[12px] justify-between">
        <Title>{title}</Title>
        <Link
          href={href}
          className="flex items-center text-active"
        >
          <span className="text-[12px] font-bold">자세히보기</span>
          <Right />
        </Link>
      </div>
    </div>
  );
}
