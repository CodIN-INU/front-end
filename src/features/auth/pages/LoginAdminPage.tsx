'use client';
//import './login.css';
import '@/styles/globals.css';
import { useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import CommonBtn from '@/components/buttons/commonBtn';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { PostLogin } from '@/features/auth/api/postLogin';
import { UserContext } from '@/context/UserContext';

export default function LoginAdminPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [schoolLoginExplained, setSchoolLoginExplained] =
    useState<boolean>(false);
  const authContext = useContext(AuthContext);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  const { User, updateUser } = userContext;

  if (!authContext) {
    throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
  }

  const { Auth, updateAuth } = authContext;

  const handleStudentIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setStudentId(e.target.value);
  };

  const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!studentId || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      updateUser({ studentId: studentId });
      console.log(`학번 업데이트: ${studentId}`);
      const response = await PostLogin(studentId, password);
      console.log(`로그인 결과: ${response}`);
      const code = response.status;
      router.push('/main');
    } catch (error) {
      console.error('로그인 실패', error);
      alert(error);
      //alert('이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.');
    }
  };

  return (
    <DefaultBody headerPadding="none">
      <div className="absolute bottom-[62px] w-full px-[20px] left-0 flex flex-col items-center justify-center">
        <img
          className="w-[171.41px] h-[45px] mb-[72px]"
          src="/images/logo.png"
        />
        <div className="flex flex-col w-full gap-[12px] mb-[169px]">
          <input
            className="defaultInput"
            id="email"
            placeholder="아이디 입력"
            value={studentId}
            onChange={handleStudentIdChange}
          />
          <input
            className="defaultInput"
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={handlePWChange}
          />
        </div>
        {/*
                <div id="else">
                
                    <button id="findPW" onClick={()=> router.push('/findPW')}> 비밀번호 찾기</button>
                    <div id="divider"> | </div>
                    <button id="signup" onClick={() => router.push('/signup')}>
                        회원가입
                    </button>
                </div>
                */}
        <div className="flex flex-row gap-[6px] mb-[22px]">
          <div className="w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]" />
          <div className="w-[12px] h-[12px] bg-[#0D99FF] rounded-[12px]" />
          <div className="w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]" />
        </div>
        <CommonBtn
          id="loginBtn"
          text="로그인하기"
          status={1}
          onClick={handleLogin}
        />
      </div>
    </DefaultBody>
  );
}
