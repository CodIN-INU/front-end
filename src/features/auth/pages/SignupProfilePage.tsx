'use client';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useEffect, useMemo } from 'react';
import { PostSignup } from '@/features/auth/api/postSignup';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';
import {
  COLLEGE_OPTIONS,
  COLLEGE_TO_DEPARTMENTS,
  DEPARTMENT_LABELS,
  type CollegeCode,
  type DepartmentCode,
} from '@/constants/college';

export default function SignupProfilePage() {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [imgPrev, setImgPrev] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<CollegeCode | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode | ''>('');
  const [nickname, setNickname] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const userContext = useContext(UserContext);
  const [email, setEmail] = useState<string | null>('');

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

  const { updateUser } = userContext;

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

  const departmentOptions = useMemo(() => {
    if (!selectedCollege) return [];
    return COLLEGE_TO_DEPARTMENTS[selectedCollege].map((code) => ({
      value: code,
      label: DEPARTMENT_LABELS[code],
    }));
  }, [selectedCollege]);

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as CollegeCode | '';
    setSelectedCollege(v);
    setSelectedDepartment('');
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment((e.target.value || '') as DepartmentCode | '');
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    const nameTrimmed = name.trim();
    const nicknameTrimmed = nickname.trim();
    const missing: string[] = [];
    if (!nameTrimmed) missing.push('이름');
    if (!selectedCollege) missing.push('단과대');
    if (!selectedDepartment) missing.push('학과');
    if (!nicknameTrimmed) missing.push('닉네임');

    if (missing.length > 0) {
      alert(`다음 항목을 입력해주세요: ${missing.join(', ')}`);
      return;
    }

    try {
      const response = await PostSignup(
        email ?? '',
        nicknameTrimmed,
        nameTrimmed,
        selectedCollege,
        selectedDepartment,
        profileImg
      );
      console.log('회원가입 결과:', response);
      alert('회원가입 완료!');
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
  };

  return (
    <div className="signup">
      {isClient && (
        <DefaultBody headerPadding="compact">
          {/* 스크롤 영역: 폼만, 하단 버튼 공간만큼 padding */}
          <div className="flex-1 min-h-0 overflow-auto pb-[140px]">
            <div className="w-full max-w-[90%] mx-auto flex flex-col items-center gap-[3vh]">
              <p className="text-Lm text-center">
                <span className="text-active">환영합니다!</span> 처음 로그인하셨어요
              </p>
              <p className="text-Mm text-sub text-center mb-[1vh]">
                정보와 프로필 사진을 등록해주세요
              </p>
              <label
                htmlFor="profileImgBtn1"
                className="flex flex-col items-center justify-center gap-[2vh]"
              >
                <img
                  className="w-[25%] min-w-[64px] max-w-[120px] aspect-square rounded-full object-cover"
                  src={imgPrev ? imgPrev : '/icons/chat/DeafultProfile.png'}
                  alt="프로필"
                />
                <p className="text-sub text-Mr underline">프로필 사진 등록 (선택)</p>
                <input
                  id="profileImgBtn1"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              {/* 1. 이름 */}
              <input
                className="defaultInput w-full min-h-[4vh]"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* 2. 단과대 → 학과 */}
              <div className="w-full flex flex-col gap-[1.5vh]">
                <select
                  className="defaultInput w-full min-h-[4vh]"
                  value={selectedCollege}
                  onChange={handleCollegeChange}
                  aria-label="단과대 선택"
                >
                  <option value="">단과대를 선택해주세요</option>
                  {COLLEGE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  className="defaultInput w-full min-h-[4vh]"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  disabled={!selectedCollege}
                  aria-label="학과 선택"
                >
                  <option value="">
                    {selectedCollege ? '학과를 선택해주세요' : '단과대를 먼저 선택해주세요'}
                  </option>
                  {departmentOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. 닉네임 */}
              <input
                className="defaultInput w-full min-h-[4vh]"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={handleNicknameChange}
              />
            </div>
          </div>

          {/* 하단 고정: 점 + 버튼 */}
          <div className="fixed bottom-[3%] left-0 right-0 bg-white px-[20px] pb-[max(env(safe-area-inset-bottom),22px)] pt-[3vh] flex flex-col items-center gap-[2vh]">
            <div className="flex flex-row gap-[1.5vw]">
              <div className="w-[2vw] min-w-[8px] max-w-[14px] aspect-square bg-[#EBF0F7] rounded-full" />
              <div className="w-[2vw] min-w-[8px] max-w-[14px] aspect-square bg-[#EBF0F7] rounded-full" />
              <div className="w-[2vw] min-w-[8px] max-w-[14px] aspect-square bg-[#0D99FF] rounded-full" />
            </div>
            <CommonBtn id="signupBtn" text="계정 등록하기" status={1} onClick={handleSubmit} />
          </div>
        </DefaultBody>
      )}
    </div>
  );
}
