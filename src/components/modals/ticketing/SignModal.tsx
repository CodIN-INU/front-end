'use client';

import { FC, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import AdminPasswordModal from './AdminPasswordModal';

interface SignModalProps {
  onClose: () => void;
  eventId: string;
}

const SignModal: FC<SignModalProps> = ({ onClose, eventId }) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setSignatureDataUrl('')
  };

  const handleConfirm = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      alert('서명을 입력해주세요.');
      return;
    }

    const dataUrl = sigCanvasRef.current?.toDataURL();
    setSignatureDataUrl(dataUrl || '');
    setShowAdminModal(true);
  };


  return (
    <div className="fixed inset-0 z-50 bg-white justify-center bottom-0 left-0 flex flex-col items-center">
      <div className="bg-white w-full h-full p-4 relative  flex flex-col justify-center max-w-[500px]">

        <div className='f flex items-end justify-between
                px-[20px] h-[80px] bg-white fixed top-0
                left-1/2 -translate-x-1/2 right-0 z-50
                w-full
                max-w-[500px] '>
            {/* 닫기 버튼 */}
            <button onClick={onClose} className="flex items-center gap-2 pb-[21px]">
                <img
                    src="/icons/back.svg"
                    alt="뒤로가기"
                    className="w-[32px] h-[32px]"
                />
            </button>

            <p className=" absolute inset-0 flex items-end justify-center
                pointer-events-none
                bottom-[26px]">서명하기</p>
        </div>
        {/* 서명 캔버스 */}
        <div className='flex flex-col justify-center mt-[-135px]'>
            <div className="bg-white aspect-square w-full rounded-xl shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] mb-2 flex items-center justify-center">
            <SignatureCanvas
                ref={sigCanvasRef}
                canvasProps={{ className: 'w-full aspect-square rounded-xl' }}
                backgroundColor="white"
                penColor="black"
            />
            {sigCanvasRef.current?.isEmpty() && (
                <span className="absolute text-sm text-gray-400">서명을 해주세요</span>
                )}
            </div>

            <p className="text-center text-[12px] text-black/50 mt-2 mb-4">수령 확인 및 본인 확인 용도로 사용됩니다.</p>
        </div>
        {/* 버튼 영역 */}
        <div className="fixed bottom-[50px] left-0 w-full px-4 bg-white pb-[35px] flex flex-col items-center">
          <button
            className="mt-3 w-full h-[50px] bg-[#EBF0F7] text-[#808080] rounded-[5px] text-[18px] font-medium max-w-[500px]"
            onClick={handleClear}
          >
            다시 쓰기
          </button>
          <button
            className="mt-3 w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]"
            onClick={handleConfirm}
          >
            확인
          </button>
        </div>

        {showAdminModal && (
          <AdminPasswordModal
            onClose={() => setShowAdminModal(false)}
            onSubmit={() => {
              onclose
            }}
            eventId={eventId}
            signatureImage={signatureDataUrl}
          />
        )}
      </div>
    </div>
  );
};

export default SignModal;
