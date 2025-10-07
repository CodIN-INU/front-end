'use client';
import { FC, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import CancelConfirmModal from './CancelConfirmModal';
interface CancelModalProps {
  onClose: () => void;
  eventId: string;
}

const CancelModal: FC<CancelModalProps> = ({
  onClose,
  eventId,
}) => { 

    const [showConfirmModal, setShowConfirmModal] = useState(false);


  const handleConfirm = async () => {
  
  try {
    
    const response = await fetchClient(`/ticketing/event/cancel/${eventId}`, {
      method: 'DELETE',
    });

    console.log('✅ 삭제 성공:', response);
    setShowConfirmModal(true);
  } catch (error) {
    console.error('❌ 전송 실패:', error);
    alert('오류가 발생했습니다.');
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex justify-center items-center">
      <div className="bg-white w-[75%] max-w-[400px] rounded-xl shadow-lg p-7 relative text-center">

        <p className="text-[14px] font-medium mb-[26px] text-[#212121]">
          정말 티켓팅을 취소하시겠습니까?.
        </p>

        
        {/* 확인 버튼 */}
        <button
          className={`w-full h-10 font-bold text-[14px] rounded transition-all duration-200 bg-[#0D99FF] text-white`}
          onClick={handleConfirm}
        >
            확인
        </button>

        <button
            className={`w-full h-10 mt-2 font-bold text-[14px] rounded transition-all duration-200 bg-[#EBF0F7] text-[#808080]`}
            onClick={()=>onClose()}
        >
            취소
        </button>

        {showConfirmModal && (
          <CancelConfirmModal
            onClose={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CancelModal;
