'use client';

import { ChatInput, NoMessages } from '@/components/chat';
import { ChatMessage } from '@/components/chat/chat-message';
import { useMessagesScroll } from '@/hooks/use-message-scroll';
import { Message } from '@/types/chat';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@material-tailwind/react';
import { useChatBot } from './hooks';

type Props = {
  onBack: () => void;
  fileName: string;
  systemMessage: string;
};

export const ChatBotRoom = ({ onBack, fileName, systemMessage }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { messagesEndRef } = useMessagesScroll(messages);

  const { isLoading, askChatBot, isError } = useChatBot();

  // useEffect(() => {
  //   const sendInitMessage = async () => {
  //     const response = await askChatBot(systemMessage);

  //     console.log('system message response', response);
  //   };

  //   sendInitMessage();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: message,
        isUser: true,
      },
    ]);

    const response = await askChatBot(message, messages);

    if (response && !isError) {
      setMessages((prev) => [...prev, response as unknown as Message]);
    }

    if (isError) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: 'Something went wrong, please try again.',
          isUser: false,
          isError: true,
        },
      ]);
    }
  };

  const renderHeader = (
    <div className="mb-2 flex w-full items-center">
      <Button
        onClick={onBack}
        placeholder=""
        variant="text"
        size="sm"
        className="flex items-center gap-1 pl-0 text-sm normal-case text-text-primary hover:bg-transparent"
      >
        <span className="icon-[iconamoon--arrow-left-2-duotone] text-2xl" />
        Back to settings
      </Button>

      <p className="ml-auto text-sm font-bold text-text-light">{fileName || 'sdf'}</p>
    </div>
  );

  return (
    <>
      {renderHeader}

      <div className="h-full w-full rounded-xl border border-browser-background bg-background-light">
        <div className="relative flex h-full w-full flex-col gap-3 p-3">
          <div
            className="flex h-full w-full flex-col gap-12 overflow-y-auto p-3"
            ref={messagesEndRef}
          >
            {!messages.length && <NoMessages />}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && <ChatMessage message={{ id: uuidv4(), isUser: false }} />}
          </div>

          <ChatInput handleSendMessage={handleSendMessage} buttonLoading={isLoading} />
        </div>
      </div>
    </>
  );
};
