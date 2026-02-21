// Message.tsx
'use client'
import { useState } from 'react'; 
import ZoomableImageModal from "@/components/modals/ZoomableImageModal";
interface MessageProps {
    id: string;
    content: string;
    createdAt: string;
    contentType: string;
    myId: string;
    unread: number;
  }


  
  const Message = ({ id, content, createdAt, contentType, myId, unread}: MessageProps) => {
    const messageClass = id !== myId ? 'message-left' : 'message-right';
  


    return (
      <div className={messageClass}>
        {id !== myId ? (
          <div id="profile"></div> // 프로필을 나타내는 div, 필요에 따라 수정 가능
        ) : (
          <div className="modi" />
        )}
        <div id={id} className={`message_${messageClass}`}>
          <div className="message-text">
            {contentType === 'IMAGE' ? (
                <section >
                    
                <ZoomableImageModal
                    images={content} 
              />
              </section>
            ) : (
              content
            )}
          </div>
        </div>
        <div id="time">{createdAt}</div>
        {messageClass === 'message-right' && unread !== 0 && (
          <div id='isRead' className="text-[#0D99FF] text-[10px] w-3 z-3 self-end mb-2">{unread}</div>
        )}
      </div>
    );
  };
  
  export default Message;
