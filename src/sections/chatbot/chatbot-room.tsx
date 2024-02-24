'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Checkbox, Typography } from '@material-tailwind/react';
import { useChat } from 'ai/react';
import { paths } from '@/app/api/endpoints';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from 'ai';
import { ChatMessageWithComparison } from '@/components/chat/chat-message-with-comparison';

type Props = {
  onBack: () => void;
  fileName: string;
  systemMessage: string;
};

export const ChatBotRoom = ({ onBack, fileName, systemMessage }: Props) => {
  const [showGPTComparison, setShowGPTComparison] = useState(false);

  const { messages, input, handleInputChange, isLoading, handleSubmit } = useChat({
    initialMessages: [
      {
        id: uuidv4(),
        content: systemMessage,
        role: 'system' as const,
      },
    ],
    body: { context: fileName },
    api: paths.customChatbot,
  });

  const { messagesEndRef } = useMessagesScroll(messages);

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
    <div
      className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3"
      ref={messagesEndRef}
    >
      {renderHeader}

      <div className="flex h-full w-full flex-col gap-12 overflow-y-auto p-3">
        {!messages.filter((m: Message) => m.role !== 'system').length && <NoMessages />}

        {messages.map((message) =>
          message.role === 'assistant' && showGPTComparison ? (
            <ChatMessageWithComparison key={message.id} message={message} />
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        )}

        {isLoading && <ChatMessage message={{ id: uuidv4(), role: 'assistant', content: '' }} />}
      </div>

      <ChatInput input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
    </div>
  );
};
