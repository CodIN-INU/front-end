// components/UserInfoModal.tsx
'use client';
import { FC, useState, useRef } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import SignatureCanvas from 'react-signature-canvas';
import { compressBase64Image } from '@/utils/compressBase64Image';

interface ChangeStatusModalProps {
  eventId: string | string[];
  userInfo:{
    userId: number;
    department: string;
    name: string;
    studentId: string;
  }
  onClose: () => void;
  onComplete: () => void;
}

const ChangeStatusModal: FC<ChangeStatusModalProps> = ({ onClose, onComplete, userInfo, eventId}) => {
  const [step, setStep] = useState<1 | 2>(1);
    const sigCanvasRef = useRef<SignatureCanvas>(null);
  
    const handleClear = () => {
      sigCanvasRef.current?.clear();
    };
  

  const postUserSign = async () => {
    if (!userInfo) return;
    
    if (sigCanvasRef.current?.isEmpty()) {
        alert('서명을 입력해주세요.');
        return;
      }
  
      const dataUrl = sigCanvasRef.current?.toDataURL();
      const formData = new FormData(); 
           const compressed = await compressBase64Image(dataUrl, {
            maxBytes: 180 * 1024,   // 필요 시 조정: 200*1024, 300*1024 등
            maxWidth: 900,          // 서명이라면 600~1000 사이 권장
            minWidth: 240,          // 더 줄일 최소 너비
            startQuality: 0.72,
            minQuality: 0.4
          });
          formData.append('signImage', compressed);

    try {
      const response = await fetchClient(`/ticketing/admin/event/${eventId}/management/status/${userInfo.userId}`, {
        method: 'PUT',
        body:  formData,
      });
      
      console.log('✅ 유저 정보 업데이트 성공:', response);
      alert('수령 완료로 변경하였습니다');
      onComplete();
    } catch (error) {
      console.error('❌ 유저 정보 업데이트 실패:', error);
    }
  };

  const handleCancle = async()=>{
    const confirmed = confirm('해당 유저의 티켓을 취소하시겠습니까?');
    if (!confirmed) return;

    try{
      await fetchClient(`/ticketing/admin/event/${eventId}/management/cancel/${userInfo.userId}`
        ,{
            method: 'DELETE'
          })
      alert('취소하였습니다');
      window.location.reload();
    }catch(error){
      console.error();
      alert('취소 중 오류가 발생했습니다. 다시 시도해주세요');
      window.location.reload();
    }
    
  }


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[70] ">
        <div className="bg-white rounded-2xl w-[80%] px-6 py-[14px] shadow-xl text-center relative max-w-[500px]">

          {/* 닫기 버튼 */}
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          ✕
        </button>
          {/* STEP 1 - Intro */}
        {step === 1 && (
          <>
      
        {/* 페이지 인디케이터 */}
            <div className="flex justify-center mb-[11px]">
              <span className="w-[10px] h-[10px] bg-[#0D99FF] rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full" />
            </div>
        
        {/* 사용자 정보 */}

            <div className=' flex flex-col'>
                <div className='text-[12px] text-[#79797B]'>{userInfo.department}</div>
                <div className='text-[14px] text-[#79797B] font-bold'>{userInfo.name}</div>
                <div className='text-[12px] text-[#0D99FF] font-bold'>{userInfo.studentId}</div>
            </div>

           
        
        {/* 버튼 */}

            <div className='flex flex-row gap-[15px] items-center justify-center mt-[13px]'>
                <button className='w-[119px] h-10 bg-[#EBF0F7] rounded-[5px] text-[#808080] text-[14px]'
                        onClick={handleCancle}>수령 취소</button>

                <button className='w-[119px] h-10 bg-[#0D99FF] rounded-[5px] text-white text-[14px]'
                        onClick={()=>setStep(2)}>수령 완료</button>
            </div>
      </>)}

       {/* STEP 2 - 학과 선택 */}
        {step === 2 && (
          <div className='flex flex-col'>
            {/* 페이지 인디케이터 */}
            <div className="flex justify-center mb-3">
              <span className="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-[#0D99FF] rounded-full" />
            </div>

             {/* 사용자 정보 */}

            <div className=' flex flex-col mb-[14px]'>
                <div className='text-[12px] text-[#79797B]'>{userInfo.department}</div>
                <div className='text-[14px] text-[#79797B] font-bold'>{userInfo.name}</div>
                <div className='text-[12px] text-[#0D99FF] font-bold'>{userInfo.studentId}</div>
            </div>

            {/* 서명 캔버스 */}
                    <div className='flex flex-col justify-center '>
                        <div className="bg-white w-full h-[160px] rounded-xl shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] mb-2 flex items-center justify-center">
                        <div className='absolute top-[113px] left-8 text-black text-[14px] font-bold flex'>서명<div className="text-blue-500 text-[22px] mt-[-15px] ml-1">•</div></div>
                        
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            canvasProps={{ className: 'w-full rounded-xl' }}
                            backgroundColor="white"
                            penColor="black"
                        />
                        {sigCanvasRef.current?.isEmpty() && (
                            <span className="absolute text-sm text-gray-400 ">서명을 해주세요</span>
                            )}
                        </div>
                        <button className='absolute top-[235px] right-8 text-[10px] text-[#808080] bg-[#EBF0F7] rounded-[5px] px-[10px] py-1'
                                onClick={handleClear}>다시 쓰기</button>
            
                        <p className="text-center text-[12px] text-black/50 mt-2 mb-4">수령 확인 및 본인 확인 용도로 사용됩니다.</p>
                    </div>
            <button
              className='w-full bg-[#0D99FF] text-white text-[14px] py-[10px] rounded-[5px]'
              disabled={!sigCanvasRef}
              onClick={postUserSign}
            >
              확인
            </button>
          </div>
        )}


         </div>
    </div>
  );
};

export default ChangeStatusModal;
