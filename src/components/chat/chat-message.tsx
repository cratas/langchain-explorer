import { Message } from '@/types/chat';
import { Spinner } from '@material-tailwind/react';
import React from 'react';

type Props = {
  message: Message;
};

export const ChatMessage = ({ message }: Props) => {
  const { content, isUser, isError } = message;

  return (
    <div className="w-full text-left text-sm">
      <div className="flex flex-row gap-3">
        <div
          className={`${!isUser ? 'bg-text-light' : 'bg-lighter-purple'} flex h-9 w-9 items-center justify-center rounded-full`}
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

          <p
            className={`${isError ? 'inline-block rounded-md border border-red-700 p-2 text-red-700' : 'text-white'}`}
          >
            {!content?.length ? <Spinner /> : content}
          </p>
        </div>
      </div>
    </div>
  );
};
