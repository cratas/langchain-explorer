'use client';

import {
  ChatInput,
  NoMessages,
  ChatMessageWithComparison,
  ChatMessage,
} from '@/frontend/components/chat';
import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { endpoints } from '@/app/api/endpoints';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { Message } from 'ai';
import { gptMessageScrollHelper } from '@/frontend/jotai/atoms';
import { useAtom } from 'jotai';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { CustomChatbotPageSettingsType } from '@/frontend/types/custom-chatbot';
import { toast } from 'react-toastify';

type Props = CustomChatbotPageSettingsType & {
  sourceName: string;
};

const USE_CASE_KEY = 'custom-chatbot-page-room';

export const CustomChatbotPageRoom = ({ sourceName, systemMessage, ...otherSettings }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const handleError = () => {
    setIsStreaming(false);

    toast.error('There was an error processing your last input. Please try again.');
  };

  const { messages, input, handleInputChange, isLoading, handleSubmit, error, stop } = useChat({
    initialMessages: [
      {
        id: generateRandomId(),
        content: systemMessage,
        role: 'system',
      },
    ],
    onResponse: () => setIsStreaming(true),
    onFinish: () => setIsStreaming(false),
    onError: handleError,
    body: { context: sourceName, useCaseKey: USE_CASE_KEY, ...otherSettings },
    api: endpoints.customChatbot.main,
  });

  const [newGptMessageSignal] = useAtom(gptMessageScrollHelper);

  const { messagesEndRef } = useMessagesScroll([messages, newGptMessageSignal]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-3">
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
        modelName={otherSettings.conversationModel}
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
