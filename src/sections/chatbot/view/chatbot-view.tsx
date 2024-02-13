'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from '@/types/chat';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useChatBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const askChatBot = async (message: string, history: Message[]): Promise<Response | null> => {
    try {
      setIsLoading(true);
      setIsError(false);

      const response = await fetch('/api/custom-chatbot', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsLoading(false);

      return await response.json();
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
      setIsError(true);

      return null;
    }
  };

  return { isLoading, isError, askChatBot };
};

export const ChatBotView = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { messagesEndRef } = useMessagesScroll(messages);

  const { isLoading, askChatBot, isError } = useChatBot();

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: message,
        isUser: true,
      },
    ]);

    const response = await askChatBot(message, messages);

    console.log('isError, respone', isError, response);

    if (response && !isError) {
      setMessages((prev) => [...prev, response as unknown as Message]);
    }

    if (isError) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: 'Something went wrong, please try again.',
          isUser: false,
          isError: true,
        },
      ]);
    }
  };

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

            {isLoading && <ChatMessage message={{ id: uuidv4(), isUser: false }} />}
          </div>

          <ChatInput handleSendMessage={handleSendMessage} buttonLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
