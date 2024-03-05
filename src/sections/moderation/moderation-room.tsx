import React, { useState } from 'react';
import { endpoints } from '@/app/api/endpoints';
import { NoMessages, ChatInput } from '@/components/chat';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { isFlagged } from '@/utils/is-flagged';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { generateRandomId } from '@/utils/generate-random-id';
import { ChatMessage } from '@/components/chat/chat-message';
import { RoomHeader } from '@/components/common';
import { FlaggedMessage } from './flagged-message';
import { ModerationUseCase } from './types';

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

  const { setMessages, messages, input, handleInputChange, isLoading, handleSubmit, stop } =
    useChat({
      api: endpoints.moderation,
      onResponse: () => setIsStreaming(true),
      initialMessages: [createModerationSystemMessageOject(selectedUseCase.systemMessage)],
      onFinish: () => setIsStreaming(false),
      onError: () => setIsStreaming(false),
    });

  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3">
      <RoomHeader
        onBack={onBack}
        onBackText="Change chat type"
        onClear={() => setMessages([])}
        title={selectedUseCase.label}
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
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
