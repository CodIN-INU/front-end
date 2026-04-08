"use client";

import { forwardRef, useImperativeHandle, useState } from 'react';

export interface WebModalHandles {
  openModal: (url: string) => void;
  closeModal: () => void;
}

const WebModal = forwardRef<WebModalHandles>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');

  useImperativeHandle(ref, () => ({
    openModal: (nextUrl: string) => {
      setUrl(nextUrl);
      setIsOpen(true);
    },
    closeModal: () => {
      setIsOpen(false);
    },
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-2xl"
            aria-label="모달 닫기"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 relative">
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full border-0"
            title="External content"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
});

WebModal.displayName = 'WebModal';

export default WebModal;
