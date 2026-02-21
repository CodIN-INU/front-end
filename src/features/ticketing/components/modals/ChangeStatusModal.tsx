// components/UserInfoModal.tsx
'use client';
import { FC, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { fetchClient } from '@/api/clients/fetchClient';
import { compressBase64Image } from '@/lib/utils/compressBase64Image';

const SignatureCanvas = dynamic(() => import('react-signature-canvas'), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-xl bg-gray-100 animate-pulse" />,
});

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
    const sigCanvasRef = useRef<any>(null);
  
    const handleClear = () => {
      sigCanvasRef.current?.clear();
    };
  

  const postUserSign = async () => {
    if (!userInfo) return;
    
    if (sigCanvasRef.current?.isEmpty()) {
        alert('??????.');
        return;
      }
  
      const dataUrl = sigCanvasRef.current?.toDataURL();
      const formData = new FormData(); 
           const compressed = await compressBase64Image(dataUrl, {
            maxBytes: 180 * 1024,   // maxBytes: 200*1024, 300*1024 ?
            maxWidth: 900,          // ?? 600~1000 ??
            minWidth: 240,          // ?? ??
            startQuality: 0.72,
            minQuality: 0.4
          });
          formData.append('signImage', compressed);

    try {
      const response = await fetchClient(`/ticketing/admin/event/${eventId}/management/status/${userInfo.userId}`, {
        method: 'PUT',
        body:  formData,
      });
      
      console.log('?? ?? ??? ?? ??:', response);
      alert('?? ???????.');
      onComplete();
    } catch (error) {
      console.error('?? ?? ??? ?? ??:', error);
    }
  };

  const handleCancle = async()=>{
    const confirmed = confirm('??? ?? ?? ??? ?????????');
    if (!confirmed) return;

    try{
      await fetchClient(`/ticketing/admin/event/${eventId}/management/cancel/${userInfo.userId}`
        ,{
            method: 'DELETE'
          })
      alert('???????.');
      window.location.reload();
    }catch(error){
      console.error();
      alert('?? ? ??? ??????. ?? ??????.');
      window.location.reload();
    }
    
  }


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[70] ">
        <div className="bg-white rounded-2xl w-[80%] px-6 py-[14px] shadow-xl text-center relative max-w-[500px]">

          {/* ?? ?? */}
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          ?
        </button>
          {/* STEP 1 - Intro */}
        {step === 1 && (
          <>
      
        {/* ??? ????? */}
            <div className="flex justify-center mb-[11px]">
              <span className="w-[10px] h-[10px] bg-[#0D99FF] rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full" />
            </div>
        
        {/* ??? ?? */}

            <div className=' flex flex-col'>
                <div className='text-[12px] text-[#79797B]'>{userInfo.department}</div>
                <div className='text-[14px] text-[#79797B] font-bold'>{userInfo.name}</div>
                <div className='text-[12px] text-[#0D99FF] font-bold'>{userInfo.studentId}</div>
            </div>

           
        
        {/* ?? */}

            <div className='flex flex-row gap-[15px] items-center justify-center mt-[13px]'>
                <button className='w-[119px] h-10 bg-[#EBF0F7] rounded-[5px] text-[#808080] text-[14px]'
                        onClick={handleCancle}>?? ??</button>

                <button className='w-[119px] h-10 bg-[#0D99FF] rounded-[5px] text-white text-[14px]'
                        onClick={()=>setStep(2)}>?? ??</button>
            </div>
      </>)}

       {/* STEP 2 - ?? ?? */}
        {step === 2 && (
          <div className='flex flex-col'>
            {/* ??? ????? */}
            <div className="flex justify-center mb-3">
              <span className="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-[#0D99FF] rounded-full" />
            </div>

             {/* ??? ?? */}

            <div className=' flex flex-col mb-[14px]'>
                <div className='text-[12px] text-[#79797B]'>{userInfo.department}</div>
                <div className='text-[14px] text-[#79797B] font-bold'>{userInfo.name}</div>
                <div className='text-[12px] text-[#0D99FF] font-bold'>{userInfo.studentId}</div>
            </div>

            {/* ?? ??? */}
                    <div className='flex flex-col justify-center '>
                        <div className="bg-white w-full h-[160px] rounded-xl shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] mb-2 flex items-center justify-center">
                        <div className='absolute top-[113px] left-8 text-black text-[14px] font-bold flex'>??<div className="text-blue-500 text-[22px] mt-[-15px] ml-1">?</div></div>
                        
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            canvasProps={{ className: 'w-full rounded-xl' }}
                            backgroundColor="white"
                            penColor="black"
                        />
                        {sigCanvasRef.current?.isEmpty() && (
                            <span className="absolute text-sm text-gray-400 ">??????</span>
                            )}
                        </div>
                        <button className='absolute top-[235px] right-8 text-[10px] text-[#808080] bg-[#EBF0F7] rounded-[5px] px-[10px] py-1'
                                onClick={handleClear}>?? ??</button>
            
                        <p className="text-center text-[12px] text-black/50 mt-2 mb-4">?? ?? ?? ? ?? ???? ?????.</p>
                    </div>
            <button
              className='w-full bg-[#0D99FF] text-white text-[14px] py-[10px] rounded-[5px]'
              disabled={!sigCanvasRef}
              onClick={postUserSign}
            >
              ??
            </button>
          </div>
        )}


         </div>
    </div>
  );
};

export default ChangeStatusModal;
