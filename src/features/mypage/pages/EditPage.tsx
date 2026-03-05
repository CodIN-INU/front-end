'use client';
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';
import { useAuth } from '@/store/userStore';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { fetchClient } from '@/shared/api/fetchClient';
import {
  COLLEGE_OPTIONS,
  COLLEGE_TO_DEPARTMENTS,
  DEPARTMENT_LABELS,
  type CollegeCode,
  type DepartmentCode,
} from '@/constants/college';
const UserInfoEditPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    nickname: '',
    department: '',
    profileImageUrl: '',
    email: '',
    college: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [initialNick, setInitialNick] = useState<string>('');
  const [initialName, setInitialName] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<CollegeCode | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode | ''>('');
  const user = useAuth((s)=> s.user);
  const updateUser = useAuth((s) => s.updateUser);
  const fetchMe = useAuth((s) => s.fetchMe);
  useEffect(() => {
    if (!user) return;
    setUserInfo({
      name: user.name,
      nickname: user.nickname,
      department: user.department,
      profileImageUrl: user.profileImageUrl,
      email: user.email,
      college: user.college ?? '',
    });
    setInitialNick(user.nickname);
    setInitialName(user.name);
    // 저장된 단과대/학과가 있으면 셀렉트에도 반영 → 학과 옵션 및 초기 선택값 표시
    const collegeVal = (user.college || '') as CollegeCode | '';
    const deptVal = (user.department || '') as DepartmentCode | '';
    setSelectedCollege(collegeVal);
    setSelectedDepartment(deptVal);
    setLoading(false);
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // 허용된 이미지 타입 리스트
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        e.target.value = ''; // 선택한 파일 초기화
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setProfileImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  // 컴포넌트 언마운트/이미지 교체 시 미리보기 URL 해제
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 유저 정보 수정
      try {
        const userResponse = await fetchClient('/users/update/info', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });
        updateUser({
          nickname: userInfo.nickname,
          name: userInfo.name,
          college: userInfo.college,
          department: userInfo.department,
          profileImageUrl: userInfo.profileImageUrl,
        })
        alert('수정이 완료되었습니다.');
        console.log('User Info Updated:', userResponse);
      } catch (err) {
        alert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        console.log(err);
      }

    // 프로필 사진 수정
    if (profileImage) {
      const formData = new FormData();
      formData.append('postImages', profileImage);
      try {
        const imageResponse = await axios.put(
          'https://codin.inu.ac.kr/api/users/profile',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data', }, withCredentials: true}
        );
        fetchMe();
        console.log('Profile Image Updated:', imageResponse.data);
        alert('수정이 완료되었습니다.');
      } catch (err) {
        alert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        console.error(err);
      }
    }
    
  };
  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as CollegeCode | '';
    setSelectedCollege(v);
    setSelectedDepartment('');
    setUserInfo((prev) => ({ ...prev, college: v, department: '' }));
  };
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = (e.target.value || '') as DepartmentCode | '';
    setSelectedDepartment(v);
    setUserInfo((prev) => ({ ...prev, department: v }));
  };
  const departmentOptions = useMemo(() => {
    if (!selectedCollege) return [];
    return COLLEGE_TO_DEPARTMENTS[selectedCollege].map((code) => ({
      value: code,
      label: DEPARTMENT_LABELS[code],
    }));
  }, [selectedCollege]);
  return (
    <Suspense>
      <Header
        title="유저 정보 수정"
        showBack
      />
      <DefaultBody headerPadding="compact">
        {loading && <LoadingOverlay/>}
        {/* 프로필 사진 수정 */}
        <div className="flex flex-col items-center mt-[18px]">
          <div className="w-[96px] h-[96px]">
            {previewUrl || userInfo.profileImageUrl ? (
              // 선택 이미지가 있으면 previewUrl 최우선, 없으면 기존 URL
              <img
                src={previewUrl ?? userInfo.profileImageUrl}
                alt="Profile Image"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="flex w-full h-full items-center justify-center text-sub text-sr">
                로딩 중
              </span>
            )}
          </div>
          <label
            htmlFor="profileImage"
            className="mt-[12px] cursor-pointer text-active text-sr font-medium"
          >
            프로필 사진 변경
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {/* 이름, 닉네임, 학과 수정 박스 */}
        <form
          onSubmit={handleSubmit}
          className="w-full mt-[24px] flex flex-col gap-[24px]"
        >
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-[8px]">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              className="defaultInput"
            />
          </div>
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-[8px]">
              닉네임
            </label>
            <input
              type="text"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleInputChange}
              className="defaultInput"
            />
          </div>
           {/* 2. 단과대 → 학과 */}
           <div className="w-full flex flex-col gap-[1.5vh]">
           <label className="block text-sm font-medium text-gray-600 mb-[8px]">
              학과 정보
            </label>
                <select
                  className="defaultInput w-full min-h-[4vh]"
                  name="college"
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
                  name="department"
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
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-[8px]">
              이메일
            </label>
            <input
              type="text"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              className="defaultInput"
              disabled={true}
            />
          </div>
          
            <div className="flex flex-col w-full items-start gap-[8px]">
              <CommonBtn
                text="수정하기"
                status={1}
                type="submit"
              />
            </div>
         
        </form>
      </DefaultBody>
    </Suspense>
  );
};
export default UserInfoEditPage;
