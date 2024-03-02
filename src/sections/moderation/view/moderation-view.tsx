import { paths } from '@/app/api/endpoints';
import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useState } from 'react';
import { FlaggedMessage } from '../flagged-message';
import { ModerationHeader } from '../moderation-header';

const isFlagged = (message: Message): boolean => {
  try {
    const { flagged } = JSON.parse(message.content);

    return flagged;
  } catch {
    return false;
  }
};

// TODO: add into view (about use case)
export const ModerationView = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const { messages, input, handleInputChange, isLoading, handleSubmit, stop } = useChat({
    api: paths.moderation,
    onResponse: () => setIsStreaming(true),
    onFinish: () => setIsStreaming(false),
    onError: () => setIsStreaming(false),
  });

  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
      <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3">
        <ModerationHeader />

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
    </div>
  );
};
