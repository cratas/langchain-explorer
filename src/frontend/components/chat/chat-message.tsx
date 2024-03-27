import { Spinner } from '@/frontend/components/tailwind-components';
import { Message } from 'ai';
import React, { ReactNode } from 'react';

type Props = {
  message: Message;
  type?: 'langchain' | 'chatgpt';
  isLoading?: boolean;
  comparasionButton?: ReactNode;
  isError?: boolean;
};

export const ChatMessage = ({
  message,
  isLoading = false,
  comparasionButton,
  type = 'langchain',
  isError,
}: Props) => {
  const { content, role } = message;

  return role !== 'system' ? (
    <div className="w-full text-left text-sm">
      <div className="flex flex-row gap-3">
        <div
          className={`${role === 'assistant' ? 'bg-text-light' : 'bg-lighter-purple'} flex h-9 min-w-9 items-center justify-center rounded-full`}
        >
          {(type === 'chatgpt' && (
            <span className="icon-[simple-icons--openai] bg-black text-xl" />
          )) ||
            (role === 'user' && <span className="icon-[solar--user-bold] bg-black text-xl" />) ||
            (role === 'assistant' && (
              <span className="icon-[lucide--bot] bg-black text-xl font-bold" />
            ))}
        </div>

        <div className="inline-block w-full text-left font-normal text-text-light">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-bold text-text-primary">
              {(type === 'chatgpt' && 'ChatGPT') ||
                (role === 'user' && 'You') ||
                (role === 'assistant' && 'AI Assistant')}
            </p>

            {comparasionButton}
          </div>

          <div
            className={`${isError ? 'inline-block rounded-md border border-red-700 p-2 text-red-700' : 'text-text-light'}`}
          >
            {isLoading ? (
              <Spinner className="mt-2" />
            ) : (
              content.split('\n').map((text, index) => (
                <p key={index} className="my-4">
                  {text}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
