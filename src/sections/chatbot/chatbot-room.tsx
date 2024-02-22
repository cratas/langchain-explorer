'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from '@/types/chat';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Checkbox, Typography } from '@material-tailwind/react';
import { ChatMessageWithComparison } from '@/components/chat/chat-message-with-comparison';
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
  const [showGPTComparison, setShowGPTComparison] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() =>
    initMessagesWithSystemMesasge(systemMessage)
  );

  const { messagesEndRef } = useMessagesScroll(messages);

  const { isLoading, askChatBot, isError, askOpenAI } = useChatBot(fileName);

  const handleSendMessage = async (message: string) => {
    const newMessage = {
      id: uuidv4(),
      content: message,
      role: 'user' as const,
    };

    setMessages((prev) => [...prev, newMessage]);

    const response = await askChatBot(message, messages);
    const gptResponseContent = await askOpenAI(message);

    if (response && !isError) {
      setMessages((prev) => [...prev, { ...response, gptResponseContent } as unknown as Message]);
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
    <div className="flex w-full items-center justify-between border-b-2 border-browser-light pb-2">
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

      <p className="text-sm font-bold text-text-primary">{fileName}</p>

      <Checkbox
        checked={showGPTComparison}
        onChange={() => setShowGPTComparison((prev) => !prev)}
        label={
          <Typography placeholder="" className="text-sm font-bold text-text-primary">
            ChatGPT comparison
          </Typography>
        }
        className="checked:border-bg-light-purple checked:border-none checked:bg-lighter-purple checked:before:bg-lighter-purple"
        crossOrigin=""
      />
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3">
      {renderHeader}

      <div className="flex h-full w-full flex-col gap-12 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m) => m.role !== 'system').length && <NoMessages />}

        {messages.map((message) =>
          message.role === 'bot' && showGPTComparison ? (
            <ChatMessageWithComparison key={message.id} message={message} />
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        )}

        {isLoading && <ChatMessage message={{ id: uuidv4(), role: 'bot' }} />}
      </div>

      <ChatInput handleSendMessage={handleSendMessage} buttonLoading={isLoading} />
    </div>
  );
};
