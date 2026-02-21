'use client';

import { useState, useRef, useEffect } from 'react';
import Polygon from '@public/icons/polygon.svg';
import clsx from 'clsx';

interface CustomSelectProps {
  onChange: (value: string) => void;
  options: string[][];
  onlyText?: boolean;
  defaultValue?: string;
}

export default function CustomSelect({
  onChange,
  options,
  onlyText = false,
  defaultValue,
}: CustomSelectProps) {
  const [selected, setSelected] = useState(defaultValue || options[0][0]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string[]) => {
    setSelected(value[0]);
    onChange(value[1]);
    setIsOpen(false);
  };

  return (
    <div
      className={clsx(
        'flex justify-center relative w-fit break-keep whitespace-normal',
        !onlyText &&
          'shadow-[0px_6px_7.2px_rgba(182,182,182,0.30)] h-[35px] rounded-[14px] bg-[#F9F9F9] min-w-[117px] max-w-[117px]'
      )}
      ref={ref}
    >
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={clsx(
          'flex items-center gap-[4px] text-sub text-[12px]',
          !onlyText && 'pl-[10px] pr-[12px]'
        )}
      >
        {!onlyText ? (
          <>
            <div className="flex justify-center items-end w-[11px] h-[11px]">
              <Polygon />
            </div>
            <span>{selected}</span>
          </>
        ) : (
          <div className="text-active text-[16px] font-bold">
            <span>{selected}</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="
          absolute text-[10px] top-[42px] w-full rounded-[10px] bg-[#FAF9F9] overflow-hidden
          shadow-[0px_4px_4px_0_rgba(0,0,0,0.09)] z-[100]"
        >
          {options.slice(1).map(val => {
            return (
              <div
                key={val[1]}
                onClick={() => handleSelect(val)}
                className={`relative py-[5px] cursor-pointer text-center hover:bg-[#EBF0F7] z-[100] ${
                  val[0] === selected
                    ? 'bg-[#EBF0F7] text-active font-normal'
                    : 'text-sub'
                }`}
              >
                {val[0]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
