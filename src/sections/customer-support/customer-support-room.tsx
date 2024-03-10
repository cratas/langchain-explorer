import { endpoints } from '@/app/api/endpoints';
import { ChatInput, NoMessages } from '@/components/chat';
import { RoomHeader } from '@/components/common';
import { InputWhisperer } from '@/components/common/input-whisperer';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Typography } from '@material-tailwind/react';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import React from 'react';

type Props = {
  onBack: () => void;
  anonymization: boolean;
};

export const CustomerSupportRoom = ({ onBack, anonymization }: Props) => {
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
            Customer Support
            <Typography placeholder="" as="span" className="ml-1 font-normal text-text-primary">
              {anonymization ? `(Anonymized)` : ''}
            </Typography>
          </Typography>
        }
      />

      <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-3" ref={messagesEndRef}>
        {!messages.filter((m: Message) => m.role !== 'system').length && <NoMessages />}
      </div>

      <InputWhisperer proposals={[]} />

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
