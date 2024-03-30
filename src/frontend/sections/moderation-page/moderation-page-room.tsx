import React, { useEffect, useState } from 'react';
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
import { FlaggedMessage } from '../moderation/flagged-message';

type Props = ModerationPageSettingsType;

const USE_CASE_KEY = 'moderation-page-room';

export const ModerationPageRoom = ({ systemMessage, ...otherSettings }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const { getTokenUsage, currentTokenUsage, initTokenUsage } = useTokenUsage(USE_CASE_KEY);

  console.log('TODO: currentTokenUsage', currentTokenUsage);

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

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-3">
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
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
