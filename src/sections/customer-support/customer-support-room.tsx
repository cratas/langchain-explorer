import { endpoints } from '@/app/api/endpoints';
import { ChatInput, NoMessages } from '@/components/chat';
import { RoomHeader } from '@/components/common';
import { InputWhisperer } from '@/components/common/input-whisperer';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Typography } from '@material-tailwind/react';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import React from 'react';
import { ADMIN_EXAMPLE_INPUTS, USER_EXAMPLE_INPUTS } from '@/constants/customer-support';
import { CustomerSupportUseCase } from './types';

type Props = {
  onBack: () => void;
  selectedUseCase: CustomerSupportUseCase;
};

export const CustomerSupportRoom = ({ onBack, selectedUseCase }: Props) => {
  const { setMessages, messages, input, stop, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: endpoints.customerSupport,
    });

  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl border border-browser-background bg-background-light p-3">
      <RoomHeader
        onBack={onBack}
        onBackText="Change settings"
        onClear={() => setMessages([])}
        title={
          <Typography placeholder="" color="white" className="flex font-bold">
            <Typography placeholder="" as="span" className="mx-1 font-normal text-text-primary">
              Role:
            </Typography>
            {selectedUseCase.label}
          </Typography>
        }
      />

      <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m: Message) => m.role !== 'system').length && <NoMessages />}
      </div>

      <InputWhisperer
        proposals={selectedUseCase.value === 'user' ? USER_EXAMPLE_INPUTS : ADMIN_EXAMPLE_INPUTS}
      />

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
