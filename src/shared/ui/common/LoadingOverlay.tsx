'use client';

import { FC, useEffect, useState } from 'react';

const LoadingOverlay: FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* 애니메이션 점 3개 */}
      <div className="flex gap-10 mb-4">
        <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce-delay-0" />
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce-delay-1" />
        <div className="w-3 h-3 rounded-full bg-sky-400 animate-bounce-delay-2" />
      </div>

      <img
        src="/images/logo.svg"
        alt="로딩 로고"
        className="w-[171px] mb-4"
      />

      <p className="text-[#AEAEAE] text-[16px] font-medium tracking-wider">
        로딩 중{dots}
      </p>
    </div>
  );
};

export default LoadingOverlay;

