import React, { useEffect, useState } from 'react';
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
import { FlaggedMessage } from './flagged-message';

const createModerationSystemMessageOject = (systemMessage: string): Message => ({
  content: systemMessage,
  role: 'system',
  id: generateRandomId(),
});

const USE_CASE_KEY = 'moderation-room';

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
  } = useTokenUsage(USE_CASE_KEY);

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
      body: { useCaseKey: USE_CASE_KEY },
      onFinish: handleFinish,
      onError: handleError,
    });

  const { messagesEndRef } = useMessagesScroll(messages);

  useEffect(() => {
    initTokenUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-light bg-background-light p-3">
      <RoomHeader
        onBack={onBack}
        onBackText="Change Chat type"
        onClear={() => setMessages([])}
        title={selectedUseCase.label}
      />

      <div
        className="relative flex h-full w-full flex-col gap-8 overflow-y-auto p-3"
        ref={messagesEndRef}
      >
        <ChatTotalCosts
          withMarginTop
          isLoading={isLoadingUsage}
          currentTokenUsage={currentTokenUsage}
          modelName="gpt-3.5-turbo"
        />

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
