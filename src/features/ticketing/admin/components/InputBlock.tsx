'use client';

import type { InputBlockProps } from '../types';

export default function InputBlock({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  withIcon,
}: InputBlockProps) {
  return (
    <section className="space-y-2 w-full ">
      <p className="text-sm font-medium">{label}</p>
      <div className="relative">
        {withIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#0D99FF" strokeWidth="1.5" />
              <path
                d="M12 8V12L14.5 14.5"
                stroke="#0D99FF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-[5px] border border-gray-200 bg-white text-sm px-3 py-3 outline-none placeholder:text-gray-400 font-normal ${
            withIcon ? 'pl-9' : ''
          }`}
        />
      </div>
    </section>
  );
}
