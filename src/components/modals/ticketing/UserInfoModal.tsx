// components/UserInfoModal.tsx
'use client';
import { FC, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
interface UserInfoModalProps {
  onClose: () => void;
  onComplete: () => void;
  initialStep?: 1 | 2 | 3 | 4;
}

const departments = [
  { id: 1, name: '임베디드 시스템공학과', icon: '/icons/ticketing/imbe.svg', sendData:'EMBEDDED'  },
  { id: 2, name: '컴퓨터공학부', icon: '/icons/ticketing/cse.svg', sendData:'COMPUTER_SCI' },
  { id: 3, name: '정보통신공학과', icon: '/icons/ticketing/infoCo.svg', sendData:'INFO_COMM'}
];

const UserInfoModal: FC<UserInfoModalProps> = ({ onClose, onComplete,  initialStep = 1 }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string>('');
  const [name, setName] = useState<string>('');



  const putUserInfo = async () => {
    if (!selectedDept || !studentId) return;

    try {
      const response = await fetchClient('/users/ticketing-participation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: selectedDept,
          studentId: studentId,
          name: name,
        }),
      });
      
      console.log('✅ 유저 정보 업데이트 성공:', response);
      onComplete();
    } catch (error) {
      console.error('❌ 유저 정보 업데이트 실패:', error);
    }
  };


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[110] ">
        <div className="bg-white rounded-2xl w-[80%] p-6 shadow-xl text-center relative max-w-[500px]">
          {/* STEP 1 - Intro */}
        {step === 1 && (
          <>
      
        {/* 건너뛰기 버튼 
        <button
          className="absolute top-4 right-4 text-[10px] text-[#AEAEAE]"
          onClick={onClose}
        >
          건너뛰기 &gt;
        </button>*/}

        {/* 안내 텍스트 */}
        <p className="text-[#212121] font-medium text-[14px] leading-[17px] mt-[29px]">
          빠른 티켓팅을 위해<br />
          수령자 정보를 먼저 입력해주세요.
        </p>

        {/* 이동 버튼 */}
        <button
          className="mt-6 mb-4 bg-[#0D99FF] text-white font-bold text-[13px] rounded-lg w-full py-2 px-[86px] h-[40px]"
          onClick={() => setStep(2)}

        >
          입력하러 가기
        </button>
     
      </>)}

       {/* STEP 2 - 학과 선택 */}
        {step === 2 && (
          <>
            {/* 페이지 인디케이터 */}
            <div className="flex justify-center mb-5 mt-3">
              <span className="w-[10px] h-[10px] bg-blue-500 rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
            </div>

            <h2 className="text-[16px] font-bold text-[#212121] mb-5">
              수령자 정보 입력
            </h2>
            <div className='flex flex-row justify-center items-start pl-2'>
                <p className="text-[14px] text-[#212121] mb-[9px]">
                학과를 선택해주세요 
                </p>
                <div className="text-blue-500 text-[25px] mt-[-20px]">•</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-[35px]">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.sendData)}
                  className={`flex flex-col items-center justify-start py-3 transition rounded-[8px] shadow-[0px_5px_8.5px_1px_rgba(212,212,212,0.59)] ${
                    selectedDept === dept.sendData
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <img src={dept.icon} alt={dept.name} className="w-8 h-8 mb-[13px]" />
                  <span className="text-[12px] font-medium text-[#212121] text-center leading-tight">
                    {dept.id === 1 && (
                        <>
                        임베디드<br />시스템공학과
                        </>
                    )}
                    {dept.id === 2 && (
                        <>
                        컴퓨터<br />공학부
                        </>
                    )}
                    {dept.id === 3 && (
                        <>
                        정보통신<br />공학과
                        </>
                    )}
                  </span>
                </button>
              ))}
               </div>

            <button
              className={`mt-2 h-10 mb-4 bg-[#0D99FF] text-white font-semibold text-[14px] rounded-lg w-full py-2 ${
                selectedDept ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!selectedDept}
              onClick={() => {
                //alert(`선택된 학과 ID: ${selectedDept}`);
                setStep(3)
              }}
            >
              다음
            </button>
          </>
        )}

         {/* STEP 3 - 이름 입력 */}
        {step === 3 && (
          <>
            <button className='flex self-start mt-[-10px] ml-[-10px]' onClick={()=>setStep(2)}>
                <img src='/icons/back.svg'></img>
            </button>
            {/* 페이지 인디케이터 */}
            <div className="flex justify-center mb-5 mt-[-10px] ">
              <span className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-blue-500 rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
            </div>

            <h2 className="text-[16px] font-bold text-[#212121] mb-5">
              수령자 정보 입력
            </h2>
            <div className='flex flex-row justify-center items-start pl-2'>
                <p className="text-[14px] text-[#212121] mb-[9px]">
                이름을 입력해주세요 
                </p>
                <div className="text-blue-500 text-[25px] mt-[-20px]">•</div>
            </div>
              
            <div className="mb-[85px]">
                <textarea placeholder={`실제 학생증 정보와 일치하지 않으면\n수령이 어려울 수 있습니다.`} 
                        className='text-center focus:outline-none flex flex-row items-center py-[9px] w-full h-[50px] border border-[#D4D4D4] rounded-[5px] placeholder:text-[10px] resize-none '
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    >

                </textarea>
               </div>

            <button
              className={`mt-2 h-10 mb-4 bg-[#0D99FF] text-white font-semibold text-[14px] rounded-lg w-full py-2 ${
                name ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!name}
              onClick={()=>setStep(4)}
            >
              다음
            </button>
          </>
        )}

         {/* STEP 4 - 학번 입력 */}
        {step === 4 && (
          <>
            <button className='flex self-start mt-[-10px] ml-[-10px]' onClick={()=>setStep(2)}>
                <img src='/icons/back.svg'></img>
            </button>
            {/* 페이지 인디케이터 */}
            <div className="flex justify-center mb-5 mt-[-10px] ">
              <span className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-gray-300 rounded-full" />
              <span className='w-[18px] h-[1px] border border-[#D9D9D9] mt-[3px]'></span>
              <span className="w-[10px] h-[10px] bg-blue-500 rounded-full" />
            </div>

            <h2 className="text-[16px] font-bold text-[#212121] mb-5">
              수령자 정보 입력
            </h2>
            <div className='flex flex-row justify-center items-start pl-2'>
                <p className="text-[14px] text-[#212121] mb-[9px]">
                학번을 입력해주세요 
                </p>
                <div className="text-blue-500 text-[25px] mt-[-20px]">•</div>
            </div>
              
            <div className="mb-[85px]">
                <textarea placeholder={`실제 학생증 정보와 일치하지 않으면\n수령이 어려울 수 있습니다.`} 
                        className='text-center focus:outline-none flex flex-row items-center py-[9px] w-full h-[50px] border border-[#D4D4D4] rounded-[5px] placeholder:text-[10px] resize-none '
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    >

                </textarea>
               </div>

            <button
              className={`mt-2 h-10 mb-4 bg-[#0D99FF] text-white font-semibold text-[14px] rounded-lg w-full py-2 ${
                studentId ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!studentId}
              onClick={
                putUserInfo
              }
            >
              다음
            </button>
          </>
        )}


         </div>
    </div>
  );
};

export default UserInfoModal;
