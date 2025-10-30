'use client';
//import './login.css';
import './loginAnimation.css';
import '@/app/globals.css';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useContext, useEffect } from 'react';
import { PostLogin } from '@/api/user/postLogin';
import { AuthContext } from '@/context/AuthContext';
import CommonBtn from '@/components/buttons/commonBtn';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { PostPortal } from '@/api/user/postPortal';
import { UserContext } from '@/context/UserContext';
import { set } from 'lodash';
import { fetchClient } from '@/api/clients/fetchClient';

export default function LoginPage() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const userContext = useContext(UserContext);

  const [isClient, setIsClient] = useState(false); // 클라이언트에서만 렌더링하도록 상태 추가

  const [waitForNotice, setWaitForNotice] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>(null); // useSearchParams에 대한 상태 추가

  const [isLoginPressed, setIsLoginPressed] = useState(false);

  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서만 렌더링하도록 설정
    setSearchParams(new URLSearchParams(window.location.search)); // 클라이언트에서만 URL 파라미터 읽기

    //일단 이렇게 구현했는데 추후 프론트에서 토큰 식별이 가능해지면 수정해야 할듯 -경완 25.08.04
    //토큰 꺼내서 있으면 자동 로그인으로
    const autoLogin = async () => {
      const response = await fetchClient('/users');
      if (response.success) {
        router.push('/main');
      }
    };
    autoLogin();
  }, []);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  if (!authContext) {
    throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
  }

  const { Auth, updateAuth } = authContext;

  useEffect(() => {
    if (searchParams && searchParams.get('error') === 'invalid_email_domain') {
      alert('@inu.ac.kr 계정으로 로그인 해주세요');
    }
  }, [searchParams]);


  useEffect(() => {
    if (Auth.accessToken) {
      console.log('새로운 토큰이 설정되었습니다:', Auth.accessToken);
    }
  }, [Auth.accessToken]); // Auth.accessToken의 변경을 감지

  /* useEffect(() => {
    setTimeout(() => {
      setWaitForNotice(false);
      console.log("hi")
    }, 3000);
  }, []); */
  // if(!schoolLoginExplained){
  //     return (
  //         <DefaultBody hasHeader={0}>
  //             <div className='absolute bottom-[62px] w-full px-[20px] left-0 flex flex-col items-center justify-center'>
  //                 <p className='text-Lm text-normal'>Codin은 <span className='text-active'>학교 계정</span>을 사용해요</p>
  //                 <p className='text-Mr text-sub mb-[48px]'>동일한 아이디와 비밀번호를 입력해주세요</p>
  //                 <img className="mb-[137px]" width="350" src='/images/schoolLoginExplain.png'/>
  //                 <div className='flex flex-row gap-[6px] mb-[22px]'>
  //                     <div className='w-[12px] h-[12px] bg-[#0D99FF] rounded-[12px]'/>
  //                     <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
  //                     <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
  //                 </div>
  //                 <CommonBtn id="loginBtn" text="이해했어요" status={1} onClick={()=>{setSchoolLoginExplained(true)}}/>
  //             </div>
  //         </DefaultBody>
  //     );
  // }

  /** 구글 로그인 버튼 클릭 시 실행되는 함수 */
  const handleGoogleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log("구글 로그인 버튼 클릭됨");
    try {
      if (!isLoginPressed) {
        const path = searchParams.get("next");
        const host = window.location.origin;

        console.log("redirect path:", path);

        // base url
        let redirectUrl = `https://codin.inu.ac.kr/api/auth/google?redirect_host=${encodeURIComponent(host)}`;

        // path가 있을 때만 붙이기
        if (path) {
          redirectUrl += `&redirect_path=${encodeURIComponent(path)}`;
        }

        window.location.href = redirectUrl;
      }
      setIsLoginPressed(true);
      setIsClient(false);
    } catch (error) {
      console.error("로그인 실패", error);
      setIsLoginPressed(false);
      alert("로그인 오류");
    }
  };



  const handleappleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      // 구글 로그인 URL로 리디렉션
      window.location.href = 'https://codin.inu.ac.kr/api/auth/apple';
    } catch (error) {
      console.error('로그인 실패', error);
      alert('로그인 오류');
    }
  };

  if (!isClient) {
    return null; // 클라이언트 사이드 렌더링이 완료되기 전까지 아무것도 렌더링하지 않음
  }

  return (
    <Suspense>
      <DefaultBody>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <img
            className="w-[171.41px] mb-[72px]"
            src="/images/logo.png"
          />
          {/* <div className='flex flex-col w-full gap-[12px] mb-[169px]'>
                      <input
                          className="defaultInput"
                          id="email"
                          placeholder="학교 아이디 입력"
                          value= {studentId}
                          onChange={handleStudentIdChange}
                      />
                      <input
                          className="defaultInput"
                          id="password"
                          type="password"
                          placeholder="학교 비밀번호 입력"
                          value={password}
                          onChange={handlePWChange}
                      />
                      <a href="https://portal.inu.ac.kr:444/enview/" className='text-Mr underline text-[#808080] w-full text-right'>비밀번호를 잊으셨나요?</a>
                  </div> */}
          {/*
                  <div id="else">

                      <button id="findPW" onClick={()=> router.push('/findPW')}> 비밀번호 찾기</button>
                      <div id="divider"> | </div>
                      <button id="signup" onClick={() => router.push('/signup')}>
                          회원가입
                      </button>
                  </div>
                 */}
          {/* <div className='flex flex-row gap-[6px] mb-[22px]'>
                      <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
                      <div className='w-[12px] h-[12px] bg-[#0D99FF] rounded-[12px]'/>
                      <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
                  </div>
                  <CommonBtn id="loginBtn" text="로그인하기" status={1} onClick={handleLogin}/> */}

          {/*
          <button onClick={handleappleLogin}>
            <img src="/images/apple.png" className="w-[175px] h-[42px] mt-3" ></img>
          </button>
          */}
        </div>

        {process.env.NEXT_PUBLIC_ENV === 'dev' && (
          <div className="text-center mt-5 pd-5 font-bold  mb-4">
            🚧 개발용 모바일 앱으로 접근 중이신 경우, admin로그인을 사용해주세요
          </div>
        )}
        <div className="absolute bottom-[0px] w-full px-[20px] left-0 flex flex-col items-center justify-end h-[330px] ">
          {/*<div className="flex items-center justify-center text-Mr text-[#808080] w-[312px] rounded-[12px] bg-white/[88] px-6 py-2 mb-[32px] drop-shadow-[0_3px_8px_rgba(0,0,0,0.15)]">
          <span className="text-[#0D99FF]">@inu.ac.kr</span>계정만 사용할 수 있어요
        </div> */}

          <div
            className={`${
              waitForNotice ? 'hidden ' : ''
            } bubble relative flex items-center justify-center transition-all duration-[500ms] mb-[24px] ${
              isLoginPressed ? 'h-[140px] ' : 'h-[62px]'
            }`}
          >
            <img
              src="/icons/auth/onlyInuAccount.svg"
              className={`h-full `}
            />
            <p
              className={
                'absolute top-0 transform text-sub ' +
                (isLoginPressed
                  ? 'translate-y-[190%] scale-[105%] bubbleTextAfterPressed font-medium'
                  : 'translate-y-1/2 text-Mr')
              }
            >
              <span className="text-active">@inu.ac.kr</span> 계정만 사용할 수
              있어요
            </p>
          </div>

          {waitForNotice ? (
            <div className="w-[348.5px] h-[48.5px] mb-[62px] flex gap-[8px] items-center justify-center rounded-[5px] bg-white floatBtnBefore">
              <p className="text-XLm text-[rgba(0,0,0,0.3)] leading-none floatBtnBeforeText">
                @inu.ac.kr 계정을 사용해주세요
              </p>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoginPressed}
              className={
                'btnAppearAnimation w-[348.5px] h-[48.5px] mb-[62px] flex gap-[8px] items-center justify-center shadow-[0_0_12px_4px_rgba(0,44,76,0.25)] rounded-[5px] bg-white floatBtn' +
                'disabled:cursor-not-allowed disabled:opacity-25 ' +
                (isLoginPressed ? 'btnClickedAnimation' : '')
              }
            >
              <img
                src="/icons/auth/googleLogo.png"
                className="w-[14px] h-[14px]"
              />
              <p className="text-XLm leading-none">Google계정으로 로그인</p>
            </button>
          )}
          {isLoginPressed && <div className="overlayBeforeLogin" />}
        </div>
      </DefaultBody>
    </Suspense>
  );
}
