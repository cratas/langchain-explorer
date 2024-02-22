import { Message } from '@/types/chat';
import { Spinner } from '@material-tailwind/react';
import React from 'react';

type Props = {
  message: Message;
  type?: 'langchain' | 'chatgpt';
};

export const ChatMessage = ({ message, type = 'langchain' }: Props) => {
  const { content, role, isError, gptResponseContent } = message;

  const abstractContent = type === 'chatgpt' ? gptResponseContent : content;

  return role !== 'system' ? (
    <div className="w-full text-left text-sm">
      <div className="flex flex-row gap-3">
        <div
          className={`${role === 'bot' ? 'bg-text-light' : 'bg-lighter-purple'} flex h-9 w-9 items-center justify-center rounded-full`}
        >
          {(type === 'chatgpt' && (
            <span className="icon-[simple-icons--openai] bg-black text-xl" />
          )) ||
            (role === 'user' && <span className="icon-[solar--user-bold] bg-black text-xl" />) ||
            (role === 'bot' && <span className="icon-[lucide--bot] bg-black text-xl font-bold" />)}
        </div>

        <div className="inline-block w-full text-left font-normal text-white">
          <p className="mb-2 text-sm font-bold text-text-primary">
            {(type === 'chatgpt' && 'ChatGPT') ||
              (role === 'user' && 'You') ||
              (role === 'bot' && 'AI Assistant')}
          </p>

          <div
            className={`${isError ? 'inline-block rounded-md border border-red-700 p-2 text-red-700' : 'text-white'}`}
          >
            {!abstractContent?.length ? (
              <Spinner />
            ) : (
              abstractContent.split('\n').map((text, index) => (
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
