'use client';

import {
  ChatInput,
  NoMessages,
  ChatMessageWithComparison,
  ChatMessage,
} from '@/frontend/components/chat';
import React, { useEffect, useState } from 'react';
import { useChat, Message } from 'ai/react';
import { endpoints } from '@/app/api/endpoints';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { gptMessageScrollHelper } from '@/frontend/jotai/atoms';
import { useAtom } from 'jotai';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { RoomHeader } from '@/frontend/components/common';
import { toast } from 'react-toastify';
import { useTokenUsage } from '@/frontend/hooks/use-token-usage';
import { ChatTotalCosts } from '@/frontend/components/chat/chat-total-costs';

type Props = {
  fileName: string;
  systemMessage: string;
};

const USE_CASE_KEY = 'custom-chatbot-room';

export const CustomChatBotRoom = ({ fileName, systemMessage }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    getTokenUsage,
    currentTokenUsage,
    initTokenUsage,
    isLoading: isLoadingUsage,
  } = useTokenUsage(USE_CASE_KEY);

  const handleError = () => {
    setIsStreaming(false);

    toast.error('There was an error processing your last input. Please try again.');
  };

  const handleFinish = () => {
    setIsStreaming(false);

    getTokenUsage();
  };

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
      onFinish: handleFinish,
      onError: handleError,
      body: { context: fileName, useCaseKey: USE_CASE_KEY },
      api: endpoints.customChatbot.sample,
    });

  const [newGptMessageSignal] = useAtom(gptMessageScrollHelper);

  const { messagesEndRef } = useMessagesScroll([messages, newGptMessageSignal]);

  useEffect(() => {
    initTokenUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-browser-background bg-background-light">
      <div className="relative flex h-full flex-col p-1.5 md:p-3">
        <RoomHeader onClear={() => setMessages([])} title={fileName} />

        <ChatTotalCosts
          isLoading={isLoadingUsage}
          withMarginTop
          currentTokenUsage={currentTokenUsage}
          modelName="gpt-3.5-turbo"
        />

        <div
          className="mt-2 flex h-full w-full flex-col gap-8 overflow-y-auto p-3"
          ref={messagesEndRef}
        >
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
          modelName="gpt-3.5-turbo"
          stop={stop}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
