'use client';

import {
  ChatInput,
  NoMessages,
  ChatMessageWithComparison,
  ChatMessage,
} from '@/frontend/components/chat';
import React, { useEffect, useMemo, useState } from 'react';
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
import { formatChatHistory } from '@/backend/utils/format-chat-history';
import { getTokensCountByLLMProvider } from '@/shared/utils/get-tokens-count-by-llm';
import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';
import { EXAMPLE_CONTEXT, QA_TEMPLATE } from '@/constants/custom-chatbot';
import { STANDALONE_QUESTION_TEMPLATE } from '@/backend/constants/prompt-templates';
import { CUSTOM_CHATBOT_SAMPLE_UC_KEY } from '@/shared/constants/use-case-keys';

type Props = {
  fileName: string;
  systemMessage: string;
};

export const CustomChatBotRoom = ({ fileName, systemMessage }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    getTokenUsage,
    currentTokenUsage,
    initTokenUsage,
    isLoading: isLoadingUsage,
  } = useTokenUsage(CUSTOM_CHATBOT_SAMPLE_UC_KEY);

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
      body: { context: fileName, useCaseKey: CUSTOM_CHATBOT_SAMPLE_UC_KEY },
      api: endpoints.customChatbot.sample,
    });

  const [newGptMessageSignal] = useAtom(gptMessageScrollHelper);

  const { messagesEndRef } = useMessagesScroll([messages, newGptMessageSignal]);

  useEffect(() => {
    initTokenUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputTokensCountIncludingPrompTemplate = useMemo(() => {
    const standaloneQuestionPromptTemplate = STANDALONE_QUESTION_TEMPLATE.replace(
      '{chat_history}',
      formatChatHistory(messages)
    ).replace('{question}', input);

    const qaPromptTemplate = QA_TEMPLATE.replace('{context}', EXAMPLE_CONTEXT).replace(
      '{question}',
      ''
    );

    return getTokensCountByLLMProvider(
      getProviderByModelName('gpt-3.5-turbo'),
      standaloneQuestionPromptTemplate.concat(qaPromptTemplate)
    );
  }, [input, messages]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-browser-background bg-background-light">
      <div className="relative flex h-full flex-col p-1.5 md:p-3">
        <RoomHeader onClear={() => setMessages([])} title={fileName} />

        <ChatTotalCosts
          embeddingModelName="text-embedding-3-small"
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
          inputCostsNote="Real cost of the input will be higher due to LLM output inside chain, which is not predictable."
          templateTokensCount={inputTokensCountIncludingPrompTemplate}
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
