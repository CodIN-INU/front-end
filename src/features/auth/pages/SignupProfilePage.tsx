'use client';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useEffect } from 'react';
import { PostSignup } from '@/features/auth/api/postSignup';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';

export default function SignupProfilePage() {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<File | null>(null); // 프로필 이미지 상태 수정
  const [imgPrev, setImgPrev] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [isClient, setIsClient] = useState(false); // 클라이언트 측 확인 상태
  const userContext = useContext(UserContext);
  const [email, setEmail] = useState<string | null>(''); // email 상태 추가

  useEffect(() => {
    setIsClient(true); // 클라이언트 측에서만 실행하도록 설정
  }, []);

  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      setEmail(searchParams.get('email') || null); // 클라이언트 측에서 email 파라미터 가져오기
    }
  }, [isClient]);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  const { User, updateUser } = userContext;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProfileImg(file);
      if (imgPrev) {
        URL.revokeObjectURL(imgPrev);
      }
      setImgPrev(URL.createObjectURL(file));
      console.log(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imgPrev) {
        URL.revokeObjectURL(imgPrev);
      }
    };
  }, [imgPrev]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickname(e.target.value);
    updateUser({ nickname: e.target.value });
  };

  useEffect(() => {
    const storedId = User.studentId;
    if (storedId) {
      setStudentId(storedId);
    }
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (nickname) {
      try {
        const response = await PostSignup(
          email ?? '',
          nickname,
          profileImg
        );
        console.log('회원가입 결과:', response);
        alert('회원가입 완료! 다시 로그인해주세요');
        router.push('/login');
      } catch (err) {
        console.error('회원가입 실패', err);
        const message =
          err &&
          typeof err === 'object' &&
          'response' in err &&
          err.response &&
          typeof err.response === 'object' &&
          'data' in err.response &&
          err.response.data &&
          typeof (err.response.data as { message?: string }).message === 'string'
            ? (err.response.data as { message: string }).message
            : '회원가입 실패';
        alert(message);
      }
    } else {
      alert("닉네임은 반드시 입력해야 합니다!");
    }
  };

  return (
    <div className='signup'>
      {isClient && (
        <DefaultBody headerPadding="compact">
          <div className='absolute bottom-[62px] w-full px-[20px] left-0 flex flex-col items-center justify-center'>
            <p className='text-Lm'><span className='text-active'>환영합니다!</span> 처음 로그인하셨어요</p>
            <p className='text-Mm text-sub mb-[48px]'>닉네임과 프로필 사진을 등록해주세요</p>
            <label htmlFor='profileImgBtn1' className='flex flex-col items-center justify-center gap-[24px]'>
              <img className='w-[87px] h-[87px] rounded-full' src={imgPrev ? imgPrev : "/icons/chat/DeafultProfile.png"} />
              <p className='text-sub text-Mr underline'>프로필 사진 등록 (선택)</p>
              <input id='profileImgBtn1' type='file' className="hidden" accept='image/*' onChange={handleImageChange} />
            </label>

            <input
              className="defaultInput mt-[33px] mb-[169px]"
              placeholder='닉네임을 입력해주세요'
              value={nickname}
              onChange={handleNicknameChange}
            />

            <div className='flex flex-row gap-[6px] mb-[22px]'>
              <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]' />
              <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]' />
              <div className='w-[12px] h-[12px] bg-[#0D99FF] rounded-[12px]' />
            </div>
            <CommonBtn id='signupBtn' text='계정 등록하기' status={1} onClick={handleSubmit} />
          </div>
        </DefaultBody>
      )}
    </div>
  );
}
