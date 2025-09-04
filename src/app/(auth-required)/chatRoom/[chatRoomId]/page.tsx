'use client';
import './chatRoom.css';
import { useRouter, useParams } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { AuthContext } from '@/context/AuthContext';
import { GetChatData } from '@/api/chat/getChatData';
import * as StompJs from '@stomp/stompjs';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { deleteRoom } from '@/api/chat/deleteRoom';
import { PostChatImage } from '@/api/chat/postChatImage';
import MessageForm from '@/components/chat/MessageForm';
import MessageList from '@/components/chat/MessageList';
import Header from '@/components/Layout/header/Header';
import MenuItem from '@/components/common/Menu/MenuItem';
// 메시지 타입 정의
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

interface MessageListProps {
  messages: Message[];
}

interface MessageFormProps {
  onMessageSubmit: (message: Message) => void;
}

export default function ChatRoom() {
  const router = useRouter();
  const { chatRoomId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
  }
  const [title, setTitle] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]); // Message 타입 배열
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [stompClient, setStompClient] = useState<any>(null);
  const [myId, setMyID] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const headers = {
    chatRoomId: chatRoomId,
  };
  const [connected, setConnected] = useState(false); // 연결 상태 추적
  const [subscription, setSubscription] = useState<any>(null); // 구독 객체 관리

  useEffect(() => {
    if (!chatRoomId) {
      return;
    }

    const socket = new SockJS('https://codin.inu.ac.kr/api/ws-stomp');
    const stomp = Stomp.over(socket);

    setStompClient(stomp);
  }, [chatRoomId]);

  useEffect(() => {
    const fetchChatRoomData = async () => {
      try {
        const title = localStorage.getItem('roomName');
        setTitle(title);

        console.log('전송데이터:', chatRoomId);
        const data = await GetChatData(chatRoomId as string, 0);
        console.log(data);

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

    console.log('전송 헤더', headers);

    stompClient.connect(headers, frame => {
      console.log('connected:', frame);
      setConnected(true);

      // /queue/{chatRoomId} 구독
      const subChatRoom = stompClient.subscribe(
        `/queue/` + chatRoomId,
        message => {
          const receivedMessage = JSON.parse(message.body);
          console.log('Received message:', receivedMessage);

          // receivedMessage.body와 receivedMessage.body.data가 존재하는지 확인
          if (
            receivedMessage &&
            receivedMessage.body &&
            receivedMessage.body.data
          ) {
            setMessages(prevMessages => [
              ...prevMessages,
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
          } else {
            console.error('유효하지 않은 메시지 데이터:', receivedMessage);
          }
        },
        headers
      );

      // /queue/unread 구독
      const subUnread = stompClient.subscribe(
        `/queue/unread/` + chatRoomId,
        message => {
          const receivedUnread = JSON.parse(message.body);
          console.log('Received unread message:', receivedUnread);

          setMessages(prevMessages => {
            return prevMessages.map(msg => ({
              ...msg,
              unread: 0, // 모든 메시지의 unread 값을 0으로 변경
            }));
          });
        },
        headers
      );

      // 구독 객체 저장 (배열 형태로 저장하여 여러 개의 구독 관리)
      setSubscription([subChatRoom, subUnread]);
    });
  }, [stompClient, myId, chatRoomId]);

  const fetchChattingData = async (page: number) => {
    setIsLoading(true);
    if (!hasMore || isLoading || page == 0) return;

    try {
      const data = await GetChatData(chatRoomId as string, page);
      const newMessages = data.data.data.chatting || [];
      if (newMessages.length === 0) {
        setHasMore(false); // 더 이상 불러올 데이터가 없음
      } else {
        setMessages(prev => [...newMessages.reverse(), ...prev]); // 이전 메시지 추가
      }
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
    if (scrollTop === 0 && hasMore && !isLoading) {
      setPage(prev => prev + 1); // 다음 페이지 요청
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const exitRoom = async (chatRoomId: string | string[]) => {
    try {
      const response = await deleteRoom(chatRoomId);
      console.log(response);
      router.push('/chat');
    } catch (error) {
      console.log('채팅방 나가기를 실패했습니다.', error);
    }
  };

  const handleMessageSubmit = async (message: Message) => {
    //setMessages((prevMessages) => [...prevMessages, message]);

    let localImageUrl = imageUrl;

    if (message.contentType === 'IMAGE') {
      try {
        const response = await PostChatImage(imageFile); // 이미지 업로드 함수 호출
        console.log('응답입니다용', response.data[0]);
        localImageUrl = response.data[0]; // 업로드된 이미지 URL을 로컬 변수에 저장
        setImageUrl(localImageUrl); // 상태를 업데이트
      } catch (error) {
        console.error('이미지 업로드 오류', error);
      }
    } else {
      console.log(message.contentType); // 다른 타입의 콘텐츠일 경우 로그만 찍음
    }

    const sendMessage = {
      type: 'SEND',
      content:
        message.contentType === 'IMAGE' ? localImageUrl : message.content,
      contentType: message.contentType,
    };
    stompClient.send(
      `/pub/chats/` + chatRoomId,
      headers,
      JSON.stringify(sendMessage)
    );
    console.log(message.content);
  };

  const disconnectSocket = () => {
    if (stompClient && connected) {
      stompClient.disconnect(() => {
        console.log('소켓 연결이 종료되었습니다.');
      });
    }
  };

  const handleBackButtonClick = () => {
    // 소켓 구독 해제
    if (subscription && Array.isArray(subscription)) {
      subscription.forEach((sub: any) => {
        sub.unsubscribe(headers); // 각 구독 객체에 대해 unsubscribe 호출
      });
      console.log('구독 해제');
    }

    // 소켓 연결 끊기
    if (stompClient && connected) {
      stompClient.disconnect(() => {
        console.log('소켓 연결이 종료되었습니다.');
      });
    }

    // 페이지 뒤로 가기
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
            <MenuItem onClick={() => exitRoom(chatRoomId)}>방 나가기</MenuItem>
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
        <MessageList
          messages={messages}
          myId={myId}
        />
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
