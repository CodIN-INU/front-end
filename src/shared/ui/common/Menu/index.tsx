"use client";

import React, { useEffect, useRef, useState } from 'react';
import MenuItem from './MenuItem';

interface MenuProps {
  children: React.ReactNode;
}

const Menu = ({ children }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={toggleMenu} aria-label="메뉴">
        <img
          src="/icons/header/ddaeng.png"
          alt="메뉴"
          width={6.5}
          height={5}
        />
      </button>

      {isOpen && (
        <div className="absolute top-8 right-0 bg-white text-gray-800 shadow-lg rounded-lg w-40 z-20">
          <ul className="flex flex-col">{children}</ul>
        </div>
      )}
    </div>
  );
};

// compound component
Menu.Item = MenuItem;

export default Menu;

