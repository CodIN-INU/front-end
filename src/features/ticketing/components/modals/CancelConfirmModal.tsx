'use client';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
interface CancelConfirmModalProps {
  onClose: () => void;
}

const CancelConfirmModal: FC<CancelConfirmModalProps> = ({
  onClose,
}) => { 

  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-[75%] max-w-[400px] rounded-xl shadow-lg p-6 relative text-center flex flex-col justify-center items-center">

        <img src='/icons/ticketing/cancelEmo.svg' className='mb-[7px]'></img>
        <p className="text-[13px] font-medium mb-[16px]">
          티켓팅 취소가 완료되었습니다.
        </p>

        
        {/* 확인 버튼 */}
        <button
          className={`w-full h-10 font-bold text-[14px] bg-[#0D99FF] text-white rounded-[5px]`}
          onClick={()=>{
            onClose();
            router.back();
          }}
        >
            확인
        </button>

      </div>
    </div>
  );
};

export default CancelConfirmModal;
