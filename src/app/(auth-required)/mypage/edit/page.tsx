'use client';
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';
import { useAuth } from '@/store/userStore';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { fetchClient } from '@/api/clients/fetchClient';

const UserInfoEditPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    nickname: '',
    department: '',
    profileImageUrl: '',
    email: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [initialNick, setInitialNick] = useState<string>('');


  const user = useAuth((s)=> s.user);
  const updateUser = useAuth((s) => s.updateUser);
  const fetchMe = useAuth((s) => s.fetchMe);

  useEffect(()=>{
    if (!user) return;
    setUserInfo({
      name: user.name,
      nickname: user.nickname,
      department: user.department,
      profileImageUrl: user.profileImageUrl,
      email: user.email,
    });
    setInitialNick(user.nickname);
    setLoading(false);
  },[user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 유저 정보 수정
    if (isNickChanged){ // 변경 사항이 있을때만 api 전송
      try {
        const userResponse = await fetchClient('/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });
        updateUser({
          nickname: userInfo.nickname
        })
        alert('수정이 완료되었습니다.');
        console.log('User Info Updated:', userResponse);
      } catch (error) {
        alert(error.message);
        console.log(error);
      }
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

      } catch (error) {
        alert(error.message);
        console.error(error);
      }
    }

    
  };



  return (
    <Suspense>
      <Header
        title="유저 정보 수정"
        showBack
      />
      <DefaultBody hasHeader={1}>
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
              disabled={true}
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

          {/* 학과 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-[8px]">
              학과
            </label>
            <input
              type="text"
              name="department"
              value={userInfo.department}
              onChange={handleInputChange}
              className="defaultInput"
              disabled={true}
            />
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
              />
            </div>
         
        </form>
      </DefaultBody>
    </Suspense>
  );
};

export default UserInfoEditPage;
