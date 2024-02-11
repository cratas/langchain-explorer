import { Message } from '@/types/chat';
import React from 'react';

type Props = {
  message: Message;
};

export const ChatMessage = ({ message }: Props) => {
  const { content, isUser } = message;

  return (
    <div className="w-full text-left text-sm">
      <div className="flex flex-row gap-3">
        <div
          className={`${!isUser ? 'bg-text-light' : 'bg-light-purple'} flex h-8 w-8 items-center justify-center rounded-full`}
        >
          {isUser ? (
            <span className="icon-[solar--user-bold] bg-black text-xl" />
          ) : (
            <span className="icon-[lucide--bot] bg-black text-xl font-bold" />
          )}
        </div>

        <div className="inline-block w-full text-left font-normal text-white">
          <p className="mb-2 text-sm font-bold text-text-primary">
            {isUser ? 'You' : 'AI Assistant'}
          </p>

          {content}
        </div>
      </div>
    </div>
  );
};
