'use client';

import React from 'react';

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  return (
    <li
      className="
                px-4 py-2
                hover:bg-gray-100
                cursor-pointer
                text-gray-700
            "
      onClick={onClick}
    >
      {children}
    </li>
  );
};

export default MenuItem;

