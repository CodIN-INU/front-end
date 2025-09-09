'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { PostSubscribe } from '@/api/fcm/postSubscribe';
import { PostUnsubscribe } from '@/api/fcm/postUnsubscribe';

export default function NotificationSettingPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        // TODO: 유저의 현재 푸시 알림 동의 여부를 받아오는 API 연결
        // const status = await GetPushNotificationStatus();
        // setIsSubscribed(status.isSubscribed);
        setIsSubscribed(false); // 현재는 false로 고정
      } catch (error) {
        console.error('푸시 알림 상태 조회 실패:', error);
      }
    };
    fetchSubscriptionStatus();
  }, []);

  // const handleToggleNotification = async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   try {
  //     if (isSubscribed) {
  //       await PostUnsubscribe();
  //     } else {
  //       await PostSubscribe();
  //     }
  //     setIsSubscribed(!isSubscribed);
  //   } catch (error) {
  //     console.error(error);
  //     alert('푸시 알림 설정 처리 중 오류가 발생했습니다.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Header
        title="푸시 알람 동의"
        showBack
      />
      <DefaultBody hasHeader={1}>
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <span className="text-main text-Mm">푸시 알람 동의</span>
          <label className="inline-flex relative items-center cursor-pointer">
            {/* <input
              type="checkbox"
              className="sr-only peer"
              checked={isSubscribed}
              // onChange={handleToggleNotification}
            />
            <div
              className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-main peer-checked:bg-main transition-colors`}
            ></div>
            <div
              className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform ${
                isSubscribed ? 'translate-x-full' : ''
              }`}
            ></div> */}
          </label>
        </div>
      </DefaultBody>
    </>
  );
}
