'use client';
import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { PostLogout } from '@/api/user/postLogout';
import { DeleteUser } from '@/api/user/deleteUser';
import WebModal, { WebModalHandles } from '@/components/modals/WebModal';
import { fetchClient } from '@/api/clients/fetchClient';
import Head from 'next/head';

interface MenuItem {
  label: string;
  href?: string;
  isSpacer?: boolean;
  onclick?: (e: React.MouseEvent<HTMLElement>) => Promise<void> | void;
  useModal?: boolean;
}

export default function MyPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<WebModalHandles>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await fetchClient('/users');

        if (result.success) {
          setUserData(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      if (confirm('로그아웃 할까요?')) {
        const response = await PostLogout();
        console.log('결과:', response);
        localStorage.clear();
        alert('성공적으로 로그아웃하였습니다.');
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error('로그아웃 실패', error);
      const message = error.response?.data?.message || '알 수 없는 오류 발생';
      alert(message);
    }
  };

  const handleDeleteAccount = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      if (confirm('정말로 탈퇴하시겠어요?')) {
        const response = await DeleteUser();
        console.log('결과:', response);
        localStorage.clear();
        alert('성공적으로 탈퇴하였습니다.');

        document.cookie.split(';').forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error('탈퇴 실패', error);
      const message = error.response?.data?.message || '알 수 없는 오류 발생';
      alert(message);
    }
  };

  const menuItems: MenuItem[] = [
    { label: '프로필 편집', href: '/mypage/edit' },
    { label: '게시글', href: '/mypage/board/posts' },
    { label: '좋아요', href: '/mypage/board/likes' },
    { label: '스크랩', href: '/mypage/board/scraps', isSpacer: true },
    { label: '이용약관', href: '/mypage/condition', isSpacer: true },
    //{ label: '알림 설정', href: '/mypage/notification', isSpacer: true },
    { label: '수령자 정보', href: '/mypage/recipientInfo' },
    { label: '티켓팅 내역', href: '/mypage/ticketing', isSpacer: true },

    // {
    //   label: "문의하기",
    //   href: "https://docs.google.com/forms/d/1pDj4qKQMMVY87zrT-1QvoqljuJap5cDQaFaDeJII00A/edit?pli=1",
    //   isSpacer: true,
    //   useModal: true,
    // },
    // {
    //   label: "이용약관",
    //   href: "https://sites.google.com/view/codin-privacy-policy/%ED%99%88",
    //   isSpacer: true,
    //   useModal: true,
    // },
    { label: '로그아웃', onclick: handleLogout },
    { label: '회원 탈퇴', onclick: handleDeleteAccount },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>유저 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <Suspense>
      <Header title="마이페이지" />

      <DefaultBody hasHeader={1}>
        <div className="flex items-center justify-between pt-[18px]">
          <div className="flex items-center space-x-[12px]">
            <img
              className="rounded-full w-[49px] h-[49px] object-cover"
              src={userData.profileImageUrl}
              width={49}
              height={49}
              alt="프로필 이미지"
            />
            <div>
              <h2 className="text-main text-Mm">{userData.name}</h2>
              <p className="text-sub text-sr">{userData.email}</p>
            </div>
          </div>
          <p className="text-Mm text-[#fff] bg-main px-[8px] py-[2px] rounded-[50px] flex justify-center items-center">
            인증됨
          </p>
        </div>

        <ul className="mt-[45px] text-Mm">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between items-center w-full px-4 py-1 rounded-lg cursor-pointer ${
                item.isSpacer ? 'mb-[48px]' : 'mb-[24px]'
              }`}
              onClick={e => {
                if (item.onclick) {
                  item.onclick(e);
                } else if (item.useModal) {
                  modalRef.current?.openModal(item.href);
                } else {
                  window.location.href = item.href;
                }
              }}
            >
              <span
                className={`${
                  item.label === '프로필 편집' ? 'text-active' : 'text-main'
                }`}
              >
                {item.label}
              </span>
              <img
                src="/icons/mypage/rightArrow.svg"
                width={20}
                height={20}
              />
            </li>
          ))}
        </ul>
      </DefaultBody>

      <WebModal ref={modalRef} />
    </Suspense>
  );
}
