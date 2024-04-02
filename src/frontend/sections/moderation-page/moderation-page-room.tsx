import React, { useEffect, useMemo, useState } from 'react';
import { endpoints } from '@/app/api/endpoints';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { ChatMessage } from '@/frontend/components/chat/chat-message';
import { isFlagged } from '@/frontend/utils/is-flagged';
import { ChatInput, NoMessages } from '@/frontend/components/chat';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { ModerationPageSettingsType } from '@/frontend/types/moderation';
import { toast } from 'react-toastify';
import { useTokenUsage } from '@/frontend/hooks/use-token-usage';
import { ChatTotalCosts } from '@/frontend/components/chat/chat-total-costs';
import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { formatChatHistory } from '@/backend/utils/format-chat-history';
import { getTokensCountByLLMProvider } from '@/shared/utils/get-tokens-count-by-llm';
import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';
import { useDebounce } from '@/frontend/hooks/use-debounce';
import { FlaggedMessage } from '../moderation/flagged-message';

type Props = ModerationPageSettingsType;

const USE_CASE_KEY = 'moderation-page-room';

export const ModerationPageRoom = ({ systemMessage, ...otherSettings }: Props) => {
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

  const { messages, input, handleInputChange, isLoading, handleSubmit, stop } = useChat({
    api: endpoints.moderation.main,
    initialMessages: [
      {
        id: generateRandomId(),
        content: systemMessage,
        role: 'system',
      },
    ],
    body: {
      useCaseKey: USE_CASE_KEY,
      ...otherSettings,
    },
    onResponse: () => setIsStreaming(true),
    onFinish: handleFinish,
    onError: handleError,
  });

  const { messagesEndRef } = useMessagesScroll(messages);

  useEffect(() => {
    initTokenUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { debouncedValue } = useDebounce(messages, 500);

  const inputTokensCountIncludingPrompTemplate = useMemo(() => {
    const promptTemplate = COMMON_TEMPLATE_WITH_CHAT_HISTORY.replace(
      '{chat_history}',
      formatChatHistory(debouncedValue)
    ).replace('{input}', '');

    return getTokensCountByLLMProvider(
      getProviderByModelName(otherSettings.conversationModel),
      promptTemplate
    );
  }, [debouncedValue, otherSettings.conversationModel]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-3 pt-0">
      <ChatTotalCosts
        currentTokenUsage={currentTokenUsage}
        isLoading={isLoadingUsage}
        modelName={otherSettings.conversationModel}
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
