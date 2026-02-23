'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { GetChatRoomData } from '@/features/chat/api/getChatRoomData';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Image from 'next/image';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatData {
  chatRoomId: string;
  roomName: string;
  lastMessage: string;
  currentMessageDate: string;
  notificationEnabled: boolean;
  unread: number;
}

export default function ChatPage() {
  const router = useRouter();
  const [stompClient, setStompClient] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [chatList, setChatList] = useState<ChatData[]>([]);

  useEffect(() => {
    const socket = new SockJS('https://codin.inu.ac.kr/api/ws-stomp');
    const stomp = Stomp.over(socket);
    setStompClient(stomp);
  }, []);

  useEffect(() => {
    if (!stompClient) return;

    stompClient.connect({}, () => {
      setConnected(true);
      stompClient.subscribe(`/user/queue/chatroom/unread`, (message: { body: string }) => {
        const receivedUnread = JSON.parse(message.body);
        setChatList(prevChatList => {
          const updatedChatList = prevChatList.map(chat =>
            chat.chatRoomId === receivedUnread.chatRoomId
              ? { ...chat, unread: receivedUnread.unread, lastMessage: receivedUnread.lastMessage }
              : chat
          );
          return updatedChatList.sort((a, b) => b.unread - a.unread);
        });
      });
    });
  }, [stompClient]);

  useEffect(() => {
    const getChatRoomData = async () => {
      try {
        const chatRoomData = await GetChatRoomData();
        setChatList(chatRoomData.data.dataList || []);
      } catch (error) {
        console.log('채팅방 정보를 불러오지 못했습니다.', error);
        setChatList([]);
      }
    };
    getChatRoomData();
  }, []);

  const handleGoChatRoom = (chatRoomID: string, roomName: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('roomName', roomName);
    router.push(`/chatRoom/${chatRoomID}`);
  };

  const ChatList = ({ chatList }: { chatList: ChatData[] }) => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return (
      <div className="flex flex-col w-full gap-[24px] relative mt-[47px]">
        {chatList.map(data => (
          <div
            key={data.chatRoomId}
            className="flex flex-row w-full gap-[13px] relative"
            onClick={() => handleGoChatRoom(data.chatRoomId, data.roomName)}
          >
            <Image
              src="/icons/chat/DeafultProfile.png"
              width={49}
              height={49}
              alt=""
              loading="eager"
            />
            <div className="flex flex-col gap-[4px]">
              <div id="name" className="text-Lm overflow-hidden">
                {data.roomName && data.roomName.length > 14
                  ? `${data.roomName.slice(0, 14)} ...`
                  : data.roomName}
              </div>
              <div id="ment" className="text-Mr text-[#808080]">
                {data.lastMessage?.startsWith('https://codin')
                  ? '( 사진 )'
                  : data.lastMessage
                    ? data.lastMessage.length > 16
                      ? `${data.lastMessage.slice(0, 16)}..`
                      : data.lastMessage
                    : '(메시지 없음)'}
              </div>
            </div>
            <div id="ect">
              <div className="absolute right-0 top-0 text-sr text-[#808080]">
                {data.currentMessageDate != null
                  ? new Date(data.currentMessageDate).toLocaleDateString('ko-KR', options)
                  : new Date().toLocaleDateString('ko-KR', options)}
              </div>
              {data.unread > 0 && (
                <div className="absolute right-0 bottom-0 text-sr rounded-[44px] bg-[#0D99FF] w-[22px] h-[22px] flex justify-center items-center text-[#FFFFFF]">
                  {data.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Suspense>
      <Header title="쪽지" />
      <DefaultBody headerPadding="compact">
        {chatList.length === 0 ? (
          <div className="text-center text-lg text-gray-500 mt-[60%]">채팅을 시작해보세요!</div>
        ) : (
          <ChatList chatList={chatList} />
        )}
      </DefaultBody>
    </Suspense>
  );
}
