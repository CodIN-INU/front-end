'use client';

import React from 'react';

interface ReloadButtonProps {
  onClick?: () => void;
}

const ReloadButton: React.FC<ReloadButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center"
      aria-label="검색"
    >
      <img
        src="/icons/header/reload.svg"
        alt="새로고칭"
        className="w-[25px] h-[25px]"
      />
    </button>
  );
};

export default ReloadButton;

