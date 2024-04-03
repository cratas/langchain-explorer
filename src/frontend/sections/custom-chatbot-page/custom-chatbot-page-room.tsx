'use client';

import {
  ChatInput,
  NoMessages,
  ChatMessageWithComparison,
  ChatMessage,
} from '@/frontend/components/chat';
import React, { useMemo, useState } from 'react';
import { useChat } from 'ai/react';
import { endpoints } from '@/app/api/endpoints';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { Message } from 'ai';
import { gptMessageScrollHelper } from '@/frontend/jotai/atoms';
import { useAtom } from 'jotai';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { CustomChatbotPageSettingsType } from '@/frontend/types/custom-chatbot';
import { toast } from 'react-toastify';
import { ChatTotalCosts } from '@/frontend/components/chat/chat-total-costs';
import { formatChatHistory } from '@/backend/utils/format-chat-history';
import { STANDALONE_QUESTION_TEMPLATE } from '@/backend/constants/prompt-templates';
import { EXAMPLE_CONTEXT, QA_TEMPLATE } from '@/constants/custom-chatbot';
import { getTokensCountByLLMProvider } from '@/shared/utils/get-tokens-count-by-llm';
import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';
import { CUSTOM_CHATBOT_MAIN_UC_KEY } from '@/shared/constants/use-case-keys';
import { TokenUsage } from '@/frontend/hooks/use-token-usage';

type Props = CustomChatbotPageSettingsType & {
  sourceName: string;
  getTokenUsage: () => Promise<void>;
  currentTokenUsage: TokenUsage;
  isLoadingUsage: boolean;
  defaultEmbeddingTokens?: number;
};

export const CustomChatbotPageRoom = ({
  sourceName,
  systemMessage,
  getTokenUsage,
  currentTokenUsage,
  isLoadingUsage,
  defaultEmbeddingTokens,
  ...otherSettings
}: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const handleError = () => {
    setIsStreaming(false);

    toast.error('There was an error processing your last input. Please try again.');
  };

  const handleFinish = () => {
    setIsStreaming(false);

    getTokenUsage();
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
    onFinish: handleFinish,
    onError: handleError,
    body: { ...otherSettings, context: sourceName, useCaseKey: CUSTOM_CHATBOT_MAIN_UC_KEY },
    api: endpoints.customChatbot.main,
  });

  const [newGptMessageSignal] = useAtom(gptMessageScrollHelper);

  const { messagesEndRef } = useMessagesScroll([messages, newGptMessageSignal]);

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
      getProviderByModelName(otherSettings.conversationModel),
      standaloneQuestionPromptTemplate.concat(qaPromptTemplate)
    );
  }, [input, messages, otherSettings.conversationModel]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-3 pt-0">
      <ChatTotalCosts
        embeddingModelName={otherSettings.embeddingModel}
        isLoading={isLoadingUsage}
        currentTokenUsage={currentTokenUsage}
        modelName={otherSettings.conversationModel}
        defaultEmbeddingTokens={defaultEmbeddingTokens}
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
        templateTokensCount={inputTokensCountIncludingPrompTemplate}
        inputCostsNote="Real cost of the input will be possibly higher or lower due to LLM output inside chain, which is not predictable."
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
