import React, { useState } from 'react';
import { endpoints } from '@/app/api/endpoints';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { ChatMessage } from '@/frontend/components/chat/chat-message';
import { isFlagged } from '@/frontend/utils/is-flagged';
import { ChatInput, NoMessages } from '@/frontend/components/chat';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { FlaggedMessage } from '../moderation/flagged-message';
import { ModerationPageSettingsType } from './types';

type Props = ModerationPageSettingsType;

export const ModerationPageRoom = ({ systemMessage, ...otherSettings }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

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
      ...otherSettings,
    },
    onResponse: () => setIsStreaming(true),
    onFinish: () => setIsStreaming(false),
    onError: () => setIsStreaming(false),
  });

  const { messagesEndRef } = useMessagesScroll(messages);

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
