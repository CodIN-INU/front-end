import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface navProps {
  title: string;
  path: string;
  params?: string;
}

export default function TopNav({
  nav,
  setCenter = false,
}: {
  nav?: navProps[];
  setCenter?: boolean;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    nav && (
      <nav className="relative flex w-full justify-evenly z-[98] rounded-b-[20px] shadow-[0_5px_13.3px_4px_rgba(212,212,212,0.59)]">
        {nav.map(item => {
          return (
            <Link
              key={item.path}
              href={`${item.path}${item.params ? item.params : ''}`}
              className="min-w-[55px]"
            >
              <div
                className={clsx(
                  'px-[10px] py-[14px] text-[14px] h-[49px] text-center font-bold box-border',
                  setCenter && 'min-w-[105px]'
                )}
                style={{
                  color: isActive(item.path) ? 'black' : '#AEAEAE',
                  borderBottom: isActive(item.path)
                    ? '2px solid #0d99ff'
                    : '2px solid transparent',
                }}
              >
                {item.title}
              </div>
            </Link>
          );
        })}
      </nav>
    )
  );
}
