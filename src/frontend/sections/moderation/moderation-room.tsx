import React, { useEffect, useMemo, useState } from 'react';
import { endpoints } from '@/app/api/endpoints';
import { NoMessages, ChatInput } from '@/frontend/components/chat';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { isFlagged } from '@/frontend/utils/is-flagged';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { ChatMessage } from '@/frontend/components/chat/chat-message';
import { RoomHeader } from '@/frontend/components/common';
import { ModerationUseCase } from '@/frontend/types/moderation';
import { toast } from 'react-toastify';
import { useTokenUsage } from '@/frontend/hooks/use-token-usage';
import { ChatTotalCosts } from '@/frontend/components/chat/chat-total-costs';
import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { getTokensCountByLLMProvider } from '@/shared/utils/get-tokens-count-by-llm';
import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';
import { formatChatHistory } from '@/backend/utils/format-chat-history';
import { MODERATION_SAMPLE_UC_KEY } from '@/shared/constants/use-case-keys';
import { FlaggedMessage } from './flagged-message';

const createModerationSystemMessageOject = (systemMessage: string): Message => ({
  content: systemMessage,
  role: 'system',
  id: generateRandomId(),
});

type Props = {
  onBack: () => void;
  selectedUseCase: ModerationUseCase;
};

export const ModerationRoom = ({ onBack, selectedUseCase }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    getTokenUsage,
    currentTokenUsage,
    initTokenUsage,
    isLoading: isLoadingUsage,
  } = useTokenUsage(MODERATION_SAMPLE_UC_KEY);

  const handleError = () => {
    setIsStreaming(false);

    toast.error('There was an error processing your last input. Please try again.');
  };

  const handleFinish = () => {
    setIsStreaming(false);

    getTokenUsage();
  };

  const { setMessages, messages, input, handleInputChange, isLoading, handleSubmit, stop } =
    useChat({
      api: endpoints.moderation.sample,
      onResponse: () => setIsStreaming(true),
      initialMessages: [createModerationSystemMessageOject(selectedUseCase.systemMessage)],
      body: { useCaseKey: MODERATION_SAMPLE_UC_KEY },
      onFinish: handleFinish,
      onError: handleError,
    });

  const { messagesEndRef } = useMessagesScroll(messages);

  useEffect(() => {
    initTokenUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputTokensCountIncludingPrompTemplate = useMemo(() => {
    const promptTemplate = COMMON_TEMPLATE_WITH_CHAT_HISTORY.replace(
      '{chat_history}',
      formatChatHistory(messages)
    ).replace('{input}', '');

    return getTokensCountByLLMProvider(getProviderByModelName('gpt-3.5-turbo'), promptTemplate);
  }, [messages]);

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-light bg-background-light p-3">
      <RoomHeader
        onBack={onBack}
        onBackText="Change Chat type"
        onClear={() => setMessages([])}
        title={selectedUseCase.label}
      />

      <ChatTotalCosts
        withMarginTop
        isLoading={isLoadingUsage}
        currentTokenUsage={currentTokenUsage}
        modelName="gpt-3.5-turbo"
      />

      <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m: Message) => m.role !== 'system').length && <NoMessages />}

        {messages.map((message) =>
          isFlagged(message) ? (
            <FlaggedMessage key={message.id} message={message} />
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        )}

        {isLoading && !isStreaming && (
          <ChatMessage isLoading message={{ content: '', role: 'assistant' } as Message} />
        )}
      </div>

      <ChatInput
        templateTokensCount={inputTokensCountIncludingPrompTemplate}
        modelName="gpt-3.5-turbo"
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
