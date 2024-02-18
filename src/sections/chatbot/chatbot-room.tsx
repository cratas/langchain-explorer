'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from '@/types/chat';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@material-tailwind/react';
import { useChatBot } from './hooks';

type Props = {
  onBack: () => void;
  fileName: string;
  systemMessage: string;
};

const initMessagesWithSystemMesasge = (systemMessage: string) => [
  { id: uuidv4(), content: systemMessage, role: 'system' as const },
];

export const ChatBotRoom = ({ onBack, fileName, systemMessage }: Props) => {
  const [messages, setMessages] = useState<Message[]>(() =>
    initMessagesWithSystemMesasge(systemMessage)
  );

  const { messagesEndRef } = useMessagesScroll(messages);

  const { isLoading, askChatBot, isError } = useChatBot(fileName);

  const handleSendMessage = async (message: string) => {
    const newMessage = {
      id: uuidv4(),
      content: message,
      role: 'user' as const,
    };

    setMessages((prev) => [...prev, newMessage]);

    const response = await askChatBot(message, messages);

    if (response && !isError) {
      setMessages((prev) => [...prev, response as unknown as Message]);
    }

    if (isError) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: 'Something went wrong, please try again.',
          role: 'bot',
          isError: true,
        },
      ]);
    }
  };

  const renderHeader = (
    <div className="flex w-full items-center border-b-2 border-browser-light pb-2">
      <Button
        onClick={onBack}
        placeholder=""
        variant="text"
        size="sm"
        className="flex items-center gap-1 pl-0 text-sm normal-case text-text-primary hover:bg-transparent"
      >
        <span className="icon-[iconamoon--arrow-left-2-duotone] text-2xl" />
        Create new ChatBot
      </Button>

      <p className="ml-auto text-sm font-bold text-text-light">{fileName || 'sdf'}</p>
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col  rounded-xl border border-browser-background bg-background-light p-3">
      {renderHeader}

      <div className="flex h-full w-full flex-col gap-12 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m) => m.role !== 'system').length && <NoMessages />}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <ChatMessage message={{ id: uuidv4(), role: 'bot' }} />}
      </div>

      <ChatInput handleSendMessage={handleSendMessage} buttonLoading={isLoading} />
    </div>
  );
};
