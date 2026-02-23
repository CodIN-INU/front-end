// pages/ticketing/ticket/page.tsx
'use client';

import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { useState, Suspense, useEffect } from 'react';
import { fetchClient } from '@/shared/api/fetchClient';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/userStore';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export default function RecipientInfo() {
  const router = useRouter();
  const departments = [
  { id: 1, name: '임베디드 시스템공학과', icon: '/icons/ticketing/imbe.svg', sendData:'EMBEDDED'  },
  { id: 2, name: '컴퓨터공학부', icon: '/icons/ticketing/cse.svg', sendData:'COMPUTER_SCI' },
  { id: 3, name: '정보통신공학과', icon: '/icons/ticketing/infoCo.svg', sendData:'INFO_COMM'}
];

  const [studentId, setStudentId] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string | null>();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialStudentId, setInitialStudentId] = useState<string>('');
  const [initialDept, setInitialDept] = useState<string | null>(null);

  const user = useAuth((s)=> s.user);
  const updateUser = useAuth((s) => s.updateUser);

  useEffect(()=>{
    if (!user) return;

    setStudentId(user.studentId);
    setSelectedDept(user.department);
    setInitialStudentId(user.studentId ?? '');
    setInitialDept(user.department ?? null);
    setIsInitializing(false);

  },[user])

  const putUserInfo = async () => {
    if (!selectedDept && !studentId) return;

    try {
      const response = await fetchClient('/users/ticketing-participation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: selectedDept,
          studentId: studentId,
        }),
      });

      updateUser({
        department: selectedDept ?? undefined,
        studentId: studentId,
      });
      
      console.log('✅ 유저 정보 업데이트 성공:', response);
      alert('수령자 정보 수정 완료!');
      router.push('/mypage');
    } catch (error) {
      console.error('❌ 유저 정보 업데이트 실패:', error);
      alert('수령자 정보 수정 실패')
    }
  };

  const hasChanges =
    studentId !== initialStudentId || selectedDept !== initialDept;

  return (
    <Suspense>
      <Header
        title="수령자 정보"
        showBack
      />

      <DefaultBody headerPadding="compact">
        {isInitializing && <LoadingOverlay />}
        <div className='flex flex-row justify-start items-start pl-2 mb-2'>
                <p className="text-[16px] text-[#212121] mb-[9px] font-semibold">
                학과 
                </p>
                <div className="text-blue-500 text-[25px] mt-[-20px]">•</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-[55px]">
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

        <div className='flex flex-row justify-start items-start pl-2 mb-2'>
                <p className="text-[16px] text-[#212121] mb-[9px] font-semibold">
                학번 
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


        <div className="fixed bottom-[50px] left-0 w-full px-4 bg-white pb-[35px] flex flex-col items-center">
                          <div className="text-[12px] text-center text-[#FF2525] font-normal">
                            수령 완료 후에는 수정할 수 없어요.
                          </div>
        
                          <button
                            className={`mt-3 w-full h-[50px]   rounded-[5px] text-[18px] font-bold max-w-[500px] ${
                                (!hasChanges) ? ' cursor-not-allowed text-[#808080] bg-[#EBF0F7] ' : 'text-white bg-[#0D99FF]'}`}
                            disabled={!hasChanges}
                            onClick={putUserInfo}
                          >
                            수정하기
                          </button>
                        </div>

      </DefaultBody>
    </Suspense>
  );
}
