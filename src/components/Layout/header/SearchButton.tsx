"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SearchButtonProps {
    onClick?: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
    const router = useRouter();
    
    const handleSearch = () => {
        if (onClick) {
            // onClick이 있으면 onClick 메서드 호출
            onClick();
        } else {
            // onClick이 없으면 호출
            router.push('/search');
        }
    };

    return (
        <button
            onClick={handleSearch}
            className="text-gray-600 hover:text-gray-900 flex items-center"
            aria-label="검색"
        >
            <img
                src="/icons/search.svg"
                alt="검색"
                className="w-[25px] h-[25px]"
            />
        </button>
    );
};

export default SearchButton;
