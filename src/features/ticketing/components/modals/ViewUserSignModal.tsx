// components/UserInfoModal.tsx
'use client';
import { FC, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { fetchClient } from '@/api/clients/fetchClient';

const SignatureCanvas = dynamic(() => import('react-signature-canvas'), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-xl bg-gray-100 animate-pulse" />,
});
interface ViewUserSignModalProps {
  userInfo:{
    userId: number;
    department: string;
    name: string;
    studentId: string;
    imageURL: string;
  }
  onClose: () => void;
  onComplete: () => void;
}

const ViewUserSignModal: FC<ViewUserSignModalProps> = ({ onClose, onComplete, userInfo}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const sigCanvasRef = useRef<any>(null);
  
    const handleClear = () => {
      sigCanvasRef.current?.clear();
    };


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 ">
        <div className="bg-white rounded-2xl w-[80%] px-6 py-[14px] shadow-xl text-center relative max-w-[500px]">
        
        {/* 닫기 버튼 */}
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          ✕
        </button>

          {/* STEP 1 - Intro */}
        {step === 1 && (
          <>

          <button className='text-[14px] text-white rounded-[20px] bg-[#0D99FF] py-2 w-20 mb-[21px] mt-5' onClick={()=> setStep(2)}>서명 보기</button>
      
        {/* 사용자 정보 */}

            <div className=' flex flex-col mb-[21px]'>
                <div className='text-[12px] text-[#79797B]'>{userInfo.department}</div>
                <div className='text-[14px] text-[#79797B] font-bold'>{userInfo.name}</div>
                <div className='text-[12px] text-[#0D99FF] font-bold'>{userInfo.studentId}</div>
            </div>

        
        {/* 사인이미지 */}
        <div className="bg-white rounded-2xl w-full h-[160px] px-6 py-[14px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] text-center relative max-w-[500px] flex items-center justify-center mb-[34px]">
            <img src={userInfo.imageURL} className='max-h-[150px] w-full'></img>
        </div>

        

           
      </>)}

       {/* STEP 2 - 서명 크게보기 */}
        {step === 2 && (
         <>
          
            {/* 서명 캔버스 */}
                    <div className='flex flex-col justify-center'>
                        <img src={userInfo.imageURL} className='w-full'></img>
                       
                    </div>
        </>
        )}


         </div>
    </div>
  );
};

export default ViewUserSignModal;
