'use client';

import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface MessageListProps {
  messages: any[];
  myId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, myId }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const formatCustomDate = (customDate: string) => {
    try {
      const [, timePart] = customDate.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const period = hours >= 12 ? '오후' : '오전';
      const formattedHours = hours % 12 || 12;
      return `${period} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return customDate;
    }
  };

  const renderMessagesWithDateSeparators = () => {
    const result: JSX.Element[] = [];
    let lastDate: string | null = null;

    messages.forEach((message, i) => {
      const messageDate = message.createdAt.split(' ')[0];
      if (messageDate !== lastDate) {
        result.push(
          <div id="date" key={`date-${messageDate}-${i}`} className="date-separator">
            {messageDate}
          </div>
        );
        lastDate = messageDate;
      }
      result.push(
        <Message
          key={i}
          id={message.senderId}
          content={message.content}
          createdAt={formatCustomDate(message.createdAt)}
          contentType={message.contentType}
          myId={myId}
          unread={message.unread}
        />
      );
    });
    return result;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="messages">
      {renderMessagesWithDateSeparators()}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
