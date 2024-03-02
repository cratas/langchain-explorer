/* eslint-disable no-plusplus */

'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { paths } from '@/app/api/endpoints';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from 'ai';
import { ChatMessageWithComparison } from '@/components/chat/chat-message-with-comparison';
import { gptMessageScrollHelper } from '@/global-states/atoms';
import { useAtom } from 'jotai';
import { generateRandomId } from '@/utils/generate-random-id';
import { RoomHeader } from '../../components/common/room-header';

type Props = {
  onBack: () => void;
  fileName: string;
  systemMessage: string;
};

export const ChatBotRoom = ({ onBack, fileName, systemMessage }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const { messages, input, handleInputChange, isLoading, handleSubmit, error, stop, setMessages } =
    useChat({
      initialMessages: [
        {
          id: generateRandomId(),
          content: systemMessage,
          role: 'system',
        },
      ],
      onResponse: () => setIsStreaming(true),
      onFinish: () => setIsStreaming(false),
      onError: () => setIsStreaming(false),
      body: { context: fileName },
      api: paths.customChatbot,
    });

  const [newGptMessageSignal] = useAtom(gptMessageScrollHelper);

  const { messagesEndRef } = useMessagesScroll([messages, newGptMessageSignal]);

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3">
      <RoomHeader
        onClear={() => setMessages([])}
        onBack={onBack}
        title={fileName}
        onBackText="Create new chat"
      />

      <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m: Message) => m.role !== 'system').length && <NoMessages />}

        {messages.map((message, idx) =>
          message.role === 'assistant' ? (
            <ChatMessageWithComparison
              isLoading={false}
              key={message.id}
              isError={!!error}
              message={message}
              question={messages?.[idx - 1]}
            />
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        )}

        {isLoading && !isStreaming && (
          <ChatMessageWithComparison
            isLoading={isLoading}
            message={{ content: '', id: '', role: 'assistant' }}
          />
        )}
      </div>

      <ChatInput
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
