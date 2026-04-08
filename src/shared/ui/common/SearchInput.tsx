'use client';

import { FC } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onChange: (query: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({
  placeholder = '검색어를 입력하세요.',
  onChange,
}) => {
  return (
    <div className="flex items-center w-full px-4 py-3 bg-[#F7F7F7] rounded-[15px] shadow-[0_6px_7.2px_rgba(182,182,182,0.3)]">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder:text-center placeholder:text-[#CDCDCD] "
        onChange={e => onChange(e.target.value)}
      />
      <Search size={18} className="text-[#CDCDCD]" />
    </div>
  );
};

export default SearchInput;

