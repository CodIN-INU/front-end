import clsx from 'clsx';

export default function ShadowBox({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={clsx(
        'relative shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] bg-white rounded-[15px]',
        className
      )}
    >
      {children}
    </div>
  );
}

