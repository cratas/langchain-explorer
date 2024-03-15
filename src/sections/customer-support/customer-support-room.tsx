import { endpoints } from '@/app/api/endpoints';
import { ChatInput, NoMessages } from '@/components/chat';
import { RoomHeader } from '@/components/common';
import { InputWhisperer } from '@/components/common/input-whisperer';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Typography } from '@material-tailwind/react';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import React, { useState } from 'react';
import { EXAMPLE_INPUTS } from '@/constants/customer-support';
import { ChatMessage } from '@/components/chat/chat-message';
import { generateRandomId } from '@/utils/generate-random-id';
import { CustomerSupportUseCase } from './types';

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
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3">
      <RoomHeader
        onBack={onBack}
        onBackText="Change settings"
        onClear={() => setMessages([])}
        title={
          <Typography placeholder="" color="white" className="font-bold">
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
