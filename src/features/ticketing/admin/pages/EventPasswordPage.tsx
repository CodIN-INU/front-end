'use client';

import { FC, Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { Header } from '@/components/Layout/header';
import { fetchClient } from '@/api/clients/fetchClient';

const EventPasswordPage: FC = () => {
  const { eventId } = useParams();
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const res = await fetchClient(`/ticketing/admin/event/${eventId}/password`);
        console.log(res.data);
        setPassword(res.data);
        setLoading(false);
      } catch (error: any) {
        alert(`데이터 불러오기 실패 :  ${error.message}`);
      }
    };

    fetchPassword();
  }, [eventId]);

  const displayPassword =
    password && password.length < 4
      ? password.padStart(4, '0')
      : password;

  return (
    <Suspense>
      <DefaultBody hasHeader={1}>
        <Header showBack />

        <div className='flex flex-col w-full h-[90vh] text-[18px] font-bold text-black'>
          <div className='flex flex-col w-full h-full justify-center items-center'>
            <div className=' mb-[21px]'>
              간식나눔 티켓 확인 비밀번호
            </div>

            <div className='text-[14px] text-[#808080] font-normal flex justify-center items-center text-center mb-[69px]'>
              빠른 수령을 위해 비밀번호를 크게 작성해 <br /> 사용자가 직접 입력하게 해주세요.
            </div>

            {!loading && displayPassword && (
              <div className="flex flex-row gap-4 mb-10">
                {displayPassword.split('').map((digit, idx) => (
                  <div
                    key={idx}
                    className="
                      w-[66px] h-[75px] mb-[89px]
                      rounded-[8px]
                      border border-[#D4D4D4]
                      flex items-center justify-center
                      text-[40px] font-bold text-[#262626]
                    "
                  >
                    {digit}
                  </div>
                ))}
              </div>
            )}

            <div className='font-notosans font-normal text-[11px] text-center text-[#FF2525] self-center'>
              비밀번호 문제 발생 시 <br />
              010-6756-0501 로 즉시 연락해주세요
            </div>
          </div>
        </div>
      </DefaultBody>
    </Suspense>
  );
};

export default EventPasswordPage;
