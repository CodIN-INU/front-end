'use client';
import '@/app/(public)/login/loginAnimation.css';
import '@/styles/globals.css';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { DefaultBody } from '@/shared/ui';
import { UserContext } from '@/context/UserContext';
import { fetchClient } from '@/shared/api/fetchClient';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  const [isLoginPressed, setIsLoginPressed] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      const response = await fetchClient<{ success?: boolean }>('/users');
      if (response?.success) {
        router.push('/main');
      }
    };
    autoLogin();
  }, [router]);

  useEffect(() => {
    if (searchParams.get('error') === 'invalid_email_domain') {
      alert('@inu.ac.kr 계정으로 로그인 해주세요');
    }
  }, [searchParams]);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  if (!authContext) {
    throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
  }

  const handleGoogleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (!isLoginPressed) {
        const path = searchParams.get('next');
        const host = window.location.origin;

        let redirectUrl = `https://codin.inu.ac.kr/api/auth/google?redirect_host=${encodeURIComponent(host)}`;

        if (path) {
          redirectUrl += `&redirect_path=${encodeURIComponent(path)}`;
        }

        window.location.href = redirectUrl;
      }
      setIsLoginPressed(true);
    } catch (error) {
      console.error('로그인 실패', error);
      setIsLoginPressed(false);
      alert('로그인 오류');
    }
  };

  return (
    <DefaultBody>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img
          className="w-[171.41px] mb-[72px]"
          src="/images/logo.png"
          alt="Codin 로고"
        />
      </div>

      {process.env.NEXT_PUBLIC_ENV === 'dev' && (
        <div className="text-center mt-5 pd-5 font-bold mb-4">
          🚧 개발용 모바일 앱으로 접근 중이신 경우, admin로그인을 사용해주세요
        </div>
      )}

      <div className="absolute bottom-[0px] w-full px-[20px] left-0 flex flex-col items-center justify-end h-[330px] ">
        <div
          className={`bubble relative flex items-center justify-center transition-all duration-[500ms] mb-[24px] ${
            isLoginPressed ? 'h-[140px] ' : 'h-[62px]'
          }`}
        >
          <img
            src="/icons/auth/onlyInuAccount.svg"
            className="h-full"
            alt=""
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

        <button
          onClick={handleGoogleLogin}
          disabled={isLoginPressed}
          className={
            'btnAppearAnimation w-[348.5px] h-[48.5px] mb-[62px] flex gap-[8px] items-center justify-center shadow-[0_0_12px_4px_rgba(0,44,76,0.25)] rounded-[5px] bg-white floatBtn ' +
            'disabled:cursor-not-allowed disabled:opacity-25 ' +
            (isLoginPressed ? 'btnClickedAnimation' : '')
          }
        >
          <img
            src="/icons/auth/googleLogo.png"
            className="w-[14px] h-[14px]"
            alt=""
          />
          <p className="text-XLm leading-none">Google계정으로 로그인</p>
        </button>

        {isLoginPressed && <div className="overlayBeforeLogin" />}
      </div>
    </DefaultBody>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
