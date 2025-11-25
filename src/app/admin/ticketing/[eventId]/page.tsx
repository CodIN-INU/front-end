'use client';

import { FC,  Suspense } from 'react';
import {useParams, useRouter } from 'next/navigation';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { Header } from '@/components/Layout/header';


const TicketingUserListPage: FC = () => {
  const router = useRouter();
  const { eventId } = useParams();
  
  return (
    <Suspense>
      <DefaultBody hasHeader={1}>
        <Header
          showBack
          title={`간식나눔`}
        />

        <div className='flex flex-col w-full h-[100vh] text-[18px] font-bold text-black justify-center'>
          <div className='flex flex-col w-full h-full'>
            <button className='bg-white shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] rounded-[15px] w-full h-[15%] mb-[39px] mt-[47px]'
                    onClick={()=>router.push(`/admin/ticketing/${eventId}/password`)}>
              간식나눔 티켓팅 <span className='text-[#0D99FF]'>비밀번호</span> 보기
            </button>

            <button className='bg-white shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] rounded-[15px] w-full h-[15%] '
                    onClick={()=>router.push(`/admin/ticketing/${eventId}/info`)}>
              <span className='text-[#0D99FF]'>수령자 정보 확인</span>하기
            </button>
          </div>

          <div className='font-notosans font-normal text-[11px] text-center text-[#FF2525] fixed bottom-24 self-center'>
            티켓팅 관련 문의: 010 - 6756 - 0501
          </div>
        </div>
     
      </DefaultBody>
    </Suspense>
  );
};

export default TicketingUserListPage;
