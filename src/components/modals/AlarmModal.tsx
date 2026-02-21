'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/header/Header';
import {
  GetNotificationList,
  Notification,
} from '@/api/notification/getNotificationList';
import { useRouter } from 'next/navigation';
import { createPostUrl } from '@/lib/utils/router/createPostUrl';

// ?½ìŒ ì²˜ë¦¬ ?”ë? (ì¶”í›„ ?¤ì œ API ?°ê²°)
const markNotificationAsRead = async (notificationId: string) => {
  console.log(`?Œë¦¼ ${notificationId} ?½ìŒ ì²˜ë¦¬`);
  await new Promise(resolve => setTimeout(resolve, 100)); // simulate network delay
};

interface ModalProps {
  onClose: () => void;
}

const AlarmModal: React.FC<ModalProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await GetNotificationList();
        if (res.success) {
          // --- ì¶”ê???ì½”ë“œ: ?±ê³µ ???°ì´?°ë? ì½˜ì†”??ì¶œë ¥?©ë‹ˆ??---
          console.log('?Œë¦¼ ëª©ë¡???±ê³µ?ìœ¼ë¡?ë¶ˆëŸ¬?”ìŠµ?ˆë‹¤:', res.dataList);
          // ---------------------------------------------------
          setNotifications(res.dataList);
        }
      } catch (error) {
        console.error('?Œë¦¼ ëª©ë¡ ë¶ˆëŸ¬?¤ê¸° ?¤íŒ¨:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'read') return n.isRead;
    if (filter === 'unread') return !n.isRead;
  });

  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }

    try {
      // ?Œë¦¼??titleê³?idë¥??¬ìš©?˜ì—¬ URL???ì„±?©ë‹ˆ??
      // notification.title??'ëª¨ì§‘?´ìš”'??'?Œí†µ?´ìš”'?€ ê°™ì´ boardData???•ì˜???´ë¦„ê³??¼ì¹˜?´ì•¼ ?©ë‹ˆ??
      const postUrl = createPostUrl(notification.title, notification.id);
      router.push(postUrl);
    } catch (error) {
      console.error('ê²Œì‹œê¸€ URL ?ì„± ?¤íŒ¨:', error);
      // URL ?ì„± ?¤íŒ¨ ?? ê¸°ë³¸ ê²½ë¡œë¡?ë¦¬ë‹¤?´ë ‰?¸í•˜ê±°ë‚˜ ?¤ë¥˜ ì²˜ë¦¬ë¥??????ˆìŠµ?ˆë‹¤.
      // router.push('/main/boards');
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col h-screen">
      <Header
        title="?Œë¦¼"
        showBack
        backOnClick={onClose}
      />

      {/* ì¹´í…Œê³ ë¦¬ ë²„íŠ¼ */}
      <div className="flex mt-20 justify-start gap-2 px-4 py-3">
        {[
          { key: 'all', label: '?„ì²´' },
          { key: 'read', label: '?½ìŒ' },
          { key: 'unread', label: '?½ì? ?ŠìŒ' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as 'all' | 'read' | 'unread')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              filter === key
                ? 'bg-[#0d99ff] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">ë¡œë”© ì¤?..</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">?ŒëŒ???†ìŠµ?ˆë‹¤.</p>
          </div>
        ) : (
          <ul className="space-y-2 mt-2">
            {filteredNotifications.map(notification => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex justify-between items-start p-3 rounded-md hover:bg-gray-50 transition cursor-pointer`}
              >
                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded w-fit">
                    {notification.title}
                  </span>
                  <span className="font-semibold text-sm">
                    {notification.title}
                  </span>
                  <span className="text-xs text-gray-500 max-w-[250px]">
                    {truncate(notification.message, 30)}
                  </span>
                </div>
                <div className="flex flex-col items-end space-y-1 relative">
                  {!notification.isRead && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                  {/*<span className="text-[10px] text-gray-400">*/}
                  {/*    {new Date(notification.createdAt).toLocaleTimeString("ko-KR", {*/}
                  {/*        hour: "2-digit",*/}
                  {/*        minute: "2-digit",*/}
                  {/*    })}*/}
                  {/*</span>*/}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default AlarmModal;
