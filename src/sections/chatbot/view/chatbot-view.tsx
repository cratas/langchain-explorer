'use client';

import { ChatInput } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from '@/types/chat';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ChatBotView = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { messagesEndRef } = useMessagesScroll(messages);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: message,
        isUser: true,
      },
    ]);

    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: message,
        isUser: false,
      },
    ]);
  };

  return (
    <div className="h-[45rem] bg-background-dark p-3">
      <div className="h-full rounded-xl border border-browser-background bg-background-light">
        <div className="relative flex h-full w-full flex-col gap-3 p-3">
          <div
            className="flex h-full w-full flex-col gap-12 overflow-y-auto p-3"
            ref={messagesEndRef}
          >
            {!messages.length && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <span className="icon-[lucide--bot] bg-black text-xl font-bold" />
                </div>
                <p className=" text-center text-xl font-bold text-text-primary">
                  How can I help you today?
                </p>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          <ChatInput handleSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
