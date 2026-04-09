'use client';

import dynamic from 'next/dynamic';
import React, { FC, useState } from 'react';

const AlarmModal = dynamic(() => import('@/shared/ui/modals/AlarmModal'), {
  ssr: false,
  loading: () => null,
});

const Notice: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={handleOpenModal}>
        <img src="/icons/header/Bell.svg" width={25} height={25} />
      </button>

      {isModalOpen && <AlarmModal onClose={handleCloseModal} />}
    </>
  );
};

export default Notice;

