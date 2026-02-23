'use client';
import { FC, useState } from 'react';
import { fetchClient } from '@/shared/api/fetchClient';
interface ChangeEventCheckModalProps {
  onClose: () => void;
  onComplete: ()=> void;
  eventId: number;
  status: string;
}

const ChangeEventCheckModal: FC<ChangeEventCheckModalProps> = ({
  onClose,
  onComplete,
  eventId,
  status
}) => { 


  const handleConfirm = async () => {
  
  try {
    
    const response = await fetchClient(`/ticketing/admin/event/${eventId}/${status}`, {
      method: 'POST',
    });

    console.log('✅ 성공:', response);
    alert('이벤트 상태 변경 완료');
    onClose();
    window.location.reload();
  } catch (error) {
    console.error('❌ 실패:', error);
    alert('오류가 발생했습니다.');
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-[77%] max-w-[400px] rounded-xl shadow-lg px-7 py-4 relative text-center flex flex-col items-center">
        

        <p className="text-[14px]  mb-1 text-[#212121] font-bold">
           {status === 'close' && ('티켓팅을 종료하시겠어요?')} {status === 'open' && ('티켓팅을 시작하시겠어요?')}
        </p>
        
        <p className='text-[10px] text-[#808080] mb-[18px] max-w-[194px] text-center'>
            {status === 'close' && ('종료 후에는 새로운 번호가 발급되지 않으며, 아직 수령하지 않은 티켓은 자동으로 취소돼요.')} {status === 'open' && ('확인을 누르시면 티켓이 바로 오픈돼요.')}
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

      </div>
    </div>
  );
};

export default ChangeEventCheckModal;
