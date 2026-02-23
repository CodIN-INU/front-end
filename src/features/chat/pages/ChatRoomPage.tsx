'use client';

import '@/features/chat/styles/chatRoom.css';
import { useRouter, useParams } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { GetChatData } from '@/features/chat/api/getChatData';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { deleteRoom } from '@/features/chat/api/deleteRoom';
import { PostChatImage } from '@/features/chat/api/postChatImage';
import MessageForm from '@/features/chat/components/room/MessageForm';
import MessageList from '@/features/chat/components/room/MessageList';
import Header from '@/components/Layout/header/Header';
import MenuItem from '@/components/common/Menu/MenuItem';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  me: boolean;
  imageUrl?: string;
  contentType: string;
  unread: number;
}

export default function ChatRoomPage() {
  const router = useRouter();
  const { chatRoomId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
  }
  const [title, setTitle] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [stompClient, setStompClient] = useState<any>(null);
  const [myId, setMyID] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const headers = { chatRoomId: chatRoomId };
  const [connected, setConnected] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!chatRoomId) return;
    const socket = new SockJS('https://codin.inu.ac.kr/api/ws-stomp');
    const stomp = Stomp.over(socket);
    setStompClient(stomp);
  }, [chatRoomId]);

  useEffect(() => {
    const fetchChatRoomData = async () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('roomName') || '' : '';
        const toEllipsis = (s: string, max: number) => {
          const chars = Array.from(s);
          return chars.length >= max ? chars.slice(0, max).join('') + '...' : s;
        };
        setTitle(toEllipsis(raw, 20));
        const data = await GetChatData(chatRoomId as string, 0);
        setMessages((data.data.data.chatting || []).slice().reverse());
        setMyID(data.data.data.currentUserId);
        setIsLoading(false);
      } catch (error) {
        console.log('채팅 정보를 불러오는 데 실패했습니다.', error);
      }
    };
    fetchChatRoomData();
  }, [chatRoomId]);

  useEffect(() => {
    if (!stompClient || !myId) return;
    stompClient.connect(headers, () => {
      setConnected(true);
      const subChatRoom = stompClient.subscribe(`/queue/` + chatRoomId, message => {
        const receivedMessage = JSON.parse(message.body);
        if (receivedMessage?.body?.data) {
          setMessages(prev => [
            ...prev,
            {
              id: receivedMessage.body.data.id,
              senderId: receivedMessage.body.data.senderId,
              content: receivedMessage.body.data.content,
              createdAt: receivedMessage.body.data.createdAt,
              me: false,
              contentType: receivedMessage.body.data.contentType,
              unread: receivedMessage.body.data.unread,
            },
          ]);
        }
      }, headers);
      const subUnread = stompClient.subscribe(`/queue/unread/` + chatRoomId, () => {
        setMessages(prev => prev.map(msg => ({ ...msg, unread: 0 })));
      }, headers);
      setSubscription([subChatRoom, subUnread]);
    });
  }, [stompClient, myId, chatRoomId]);

  const fetchChattingData = async (pageNum: number) => {
    setIsLoading(true);
    if (!hasMore || isLoading || pageNum === 0) return;
    try {
      const data = await GetChatData(chatRoomId as string, pageNum);
      const newMessages = data.data.data.chatting || [];
      if (newMessages.length === 0) setHasMore(false);
      else setMessages(prev => [...newMessages.reverse(), ...prev]);
    } catch (error) {
      console.error('채팅 정보를 불러오는 데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChattingData(page);
  }, [page]);

  const handleScroll = () => {
    if (!chatBoxRef.current) return;
    const { scrollTop } = chatBoxRef.current;
    if (scrollTop === 0 && hasMore && !isLoading) setPage(prev => prev + 1);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const exitRoom = async (chatRoomIdParam: string | string[]) => {
    try {
      await deleteRoom(chatRoomIdParam);
      router.push('/chat');
    } catch (error) {
      console.log('채팅방 나가기를 실패했습니다.', error);
    }
  };

  const handleMessageSubmit = async (message: Message) => {
    let localImageUrl = imageUrl;
    if (message.contentType === 'IMAGE') {
      try {
        const response = await PostChatImage(imageFile!);
        localImageUrl = response.data[0];
        setImageUrl(localImageUrl);
      } catch (error) {
        console.error('이미지 업로드 오류', error);
      }
    }
    const sendMessage = {
      type: 'SEND',
      content: message.contentType === 'IMAGE' ? localImageUrl : message.content,
      contentType: message.contentType,
    };
    stompClient.send(`/pub/chats/` + chatRoomId, headers, JSON.stringify(sendMessage));
  };

  const handleBackButtonClick = () => {
    if (subscription && Array.isArray(subscription)) {
      subscription.forEach((sub: any) => sub.unsubscribe(headers));
    }
    if (stompClient && connected) {
      stompClient.disconnect(() => {});
    }
    router.push('/chat');
  };

  return (
    <div className="chatroom">
      <Header
        showBack
        backOnClick={handleBackButtonClick}
        title={title}
        MenuItems={() => (
          <>
            <MenuItem onClick={() => exitRoom(chatRoomId!)}>방 나가기</MenuItem>
          </>
        )}
      />
      <div
        id="chatBox"
        ref={chatBoxRef}
        onScroll={handleScroll}
        style={{ zIndex: imageFile ? 0 : 3 }}
      >
        {isLoading && <div className="loading">Loading...</div>}
        <MessageList messages={messages} myId={myId} />
      </div>
      <div id="divider"></div>
      <MessageForm
        onMessageSubmit={handleMessageSubmit}
        myId={myId}
        imageFile={imageFile}
        setImageFile={setImageFile}
      />
    </div>
  );
}
