import { endpoints } from '@/app/api/endpoints';
import { ChatInput, NoMessages } from '@/frontend/components/chat';
import { RoomHeader } from '@/frontend/components/common';
import { InputWhisperer } from '@/frontend/components/common/input-whisperer';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { Typography } from '@/frontend/components/tailwind-components';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import React, { useState } from 'react';
import { ChatMessage } from '@/frontend/components/chat/chat-message';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { CustomerSupportUseCase } from '@/frontend/types/customer-support';
import { EXAMPLE_INPUTS } from '@/frontend/constants/customer-support';

const createCustomerSupportSystemMessageOject = (systemMessage: string): Message => ({
  content: systemMessage,
  role: 'system',
  id: generateRandomId(),
});

type Props = {
  onBack: () => void;
  selectedUseCase: CustomerSupportUseCase;
};

export const CustomerSupportRoom = ({ onBack, selectedUseCase }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const { setMessages, messages, input, stop, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: endpoints.customerSupport,
      onResponse: () => setIsStreaming(true),
      initialMessages: [createCustomerSupportSystemMessageOject(selectedUseCase.systemMessage)],
      onFinish: () => setIsStreaming(false),
      onError: () => setIsStreaming(false),
    });

  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-light bg-background-light p-3">
      <RoomHeader
        onBack={onBack}
        onBackText="Change settings"
        onClear={() => setMessages([])}
        title={
          <Typography color="white" className="font-bold">
            <span className="mx-1 font-normal text-text-primary">Role:</span>
            {selectedUseCase.label}
          </Typography>
        }
      />

      <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m: Message) => m.role !== 'system').length && <NoMessages />}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && !isStreaming && (
          <ChatMessage isLoading message={{ content: '', role: 'assistant' } as Message} />
        )}
      </div>

      <InputWhisperer proposals={EXAMPLE_INPUTS} />

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
