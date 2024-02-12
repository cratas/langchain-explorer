'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from '@/types/chat';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ChatBotView = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { messagesEndRef } = useMessagesScroll(messages);

  const [isFetching, setIsFetching] = useState(false);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: message,
        isUser: true,
      },
    ]);

    setIsFetching(true);
    fetch('/api/custom-chatbot', {
      method: 'POST',
      body: JSON.stringify({ message, history: messages }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            content: data.content,
            isUser: false,
          },
        ]);
        setIsFetching(false);
      });
  };

  console.log('messages', isFetching);

  return (
    <div className="h-[35rem] bg-background-dark p-3">
      <div className="h-full rounded-xl border border-browser-background bg-background-light">
        <div className="relative flex h-full w-full flex-col gap-3 p-3">
          <div
            className="flex h-full w-full flex-col gap-12 overflow-y-auto p-3"
            ref={messagesEndRef}
          >
            {!messages.length && <NoMessages />}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          <ChatInput handleSendMessage={handleSendMessage} buttonLoading={isFetching} />
        </div>
      </div>
    </div>
  );
};
