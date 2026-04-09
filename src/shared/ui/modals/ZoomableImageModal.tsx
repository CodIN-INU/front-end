'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ZoomableImageModalProps {
  images: string | string[];
  mode?: 'list' | 'banner';
}

const ZoomableImageModal: React.FC<ZoomableImageModalProps> = ({
  images,
  mode = 'list',
}) => {
  const imageArray = Array.isArray(images) ? images : [images];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const openModal = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    setDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPosition({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (!dragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({ x: clientX - startPosition.x, y: clientY - startPosition.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastTouchDistance.current) {
        const zoomDelta = touchDistance / lastTouchDistance.current;
        setScale(prev => Math.min(5, Math.max(1, prev * zoomDelta)));
      }
      lastTouchDistance.current = touchDistance;
    } else if (dragging && e.touches.length === 1) {
      handleMouseMove(e);
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    handleMouseUp();
  };

  const [bannerIndex, setBannerIndex] = useState(0);
  const goToNextBanner = () => {
    setBannerIndex(prev => (prev + 1) % imageArray.length);
  };
  const goToPrevBanner = () => {
    setBannerIndex(prev => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  return (
    <div>
      {mode === 'list' && (
        <>
          {imageArray.length === 1 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={imageArray[0]}
                alt="Single Image"
                layout="responsive"
                width={800}
                height={600}
                className="object-cover rounded-lg"
                onClick={() => openModal(0)}
              />
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-2 p-2 bg-gray-200 rounded">
              {imageArray.map((imageUrl, index) => (
                <div
                  key={index}
                  className="w-32 h-32 flex-shrink-0 relative cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <Image
                    src={imageUrl}
                    alt={`Thumbnail ${index}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'banner' && (
        <div className="relative w-full h-[400px] bg-black overflow-hidden">
          <div
            className="w-full h-full flex transition-transform duration-300"
            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
          >
            {imageArray.map((imgUrl, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                <Image
                  src={imgUrl}
                  alt={`Banner Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>

          <button
            onClick={goToPrevBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative border-4 border-white bg-gray-400"
            onClick={e => e.stopPropagation()}
            style={{
              cursor: dragging ? 'grabbing' : 'grab',
              overflow: 'hidden',
              touchAction: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 z-50"
              style={{ cursor: 'pointer' }}
            >
              <IoClose size={24} />
            </button>

            {imageArray.length > 1 && (
              <>
                <button
                  onClick={() => {
                    if (modalIndex > 0) {
                      setModalIndex(modalIndex - 1);
                      resetZoom();
                    }
                  }}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 ${
                    modalIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={modalIndex === 0}
                  style={{ zIndex: 100 }}
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={() => {
                    if (modalIndex < imageArray.length - 1) {
                      setModalIndex(modalIndex + 1);
                      resetZoom();
                    }
                  }}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 ${
                    modalIndex === imageArray.length - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={modalIndex === imageArray.length - 1}
                  style={{ zIndex: 100 }}
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}

            <div
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center',
                transition: dragging ? 'none' : 'transform 0.3s ease',
              }}
            >
              <Image
                src={imageArray[modalIndex]}
                alt={`Image ${modalIndex + 1}`}
                layout="intrinsic"
                width={800}
                height={600}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomableImageModal;

