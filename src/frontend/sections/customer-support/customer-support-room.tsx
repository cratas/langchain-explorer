import { endpoints } from '@/app/api/endpoints';
import { ChatInput, NoMessages } from '@/frontend/components/chat';
import { RoomHeader } from '@/frontend/components/common';
import { InputWhisperer } from '@/frontend/components/common/input-whisperer';
import { useMessagesScroll } from '@/frontend/hooks/use-message-scroll';
import { Typography } from '@/frontend/components/tailwind-components';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import React, { useEffect, useState } from 'react';
import { ChatMessage } from '@/frontend/components/chat/chat-message';
import { generateRandomId } from '@/shared/utils/generate-random-id';
import { CustomerSupportUseCase } from '@/frontend/types/customer-support';
import { EXAMPLE_INPUTS } from '@/frontend/constants/customer-support';
import { toast } from 'react-toastify';
import { useTokenUsage } from '@/frontend/hooks/use-token-usage';
import { ChatTotalCosts } from '@/frontend/components/chat/chat-total-costs';

const createCustomerSupportSystemMessageOject = (systemMessage: string): Message => ({
  content: systemMessage,
  role: 'system',
  id: generateRandomId(),
});

type Props = {
  onBack: () => void;
  selectedUseCase: CustomerSupportUseCase;
};

const USE_CASE_KEY = 'customer-support-room';

export const CustomerSupportRoom = ({ onBack, selectedUseCase }: Props) => {
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

  const { setMessages, messages, input, stop, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: endpoints.customerSupport,
      onResponse: () => setIsStreaming(true),
      initialMessages: [createCustomerSupportSystemMessageOject(selectedUseCase.systemMessage)],
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
        onBackText="Change settings"
        onClear={() => setMessages([])}
        title={
          <Typography color="white" className="font-bold">
            <span className="mx-1 font-normal text-text-primary">Role:</span>
            {selectedUseCase.label}
          </Typography>
        }
      />

      <ChatTotalCosts
        withMarginTop
        isLoading={isLoadingUsage}
        currentTokenUsage={currentTokenUsage}
        modelName="gpt-3.5-turbo"
      />

      <div
        className="mt-2 flex h-full w-full flex-col gap-8 overflow-y-auto p-3"
        ref={messagesEndRef}
      >
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
        modelName="gpt-3.5-turbo-0125"
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
