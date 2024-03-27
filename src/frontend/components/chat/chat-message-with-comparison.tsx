import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Message } from 'ai/react';
import { useChatGptChat } from '@/frontend/hooks/use-chat-gpt-chat';
import { Button } from '@/frontend/components/tailwind-components';
import { ChatMessage } from './chat-message';

type Props = {
  message: Message;
  question?: Message;
  isLoading: boolean;
  isError?: boolean;
};

const Wrapper = ({
  children,
  showComparison = false,
}: PropsWithChildren<{ showComparison?: boolean }>) => (
  <div
    className={`${showComparison ? 'w-full md:w-[50%]' : 'w-full'} rounded-xl border-2 border-browser-light p-3`}
  >
    {children}
  </div>
);

export const ChatMessageWithComparison = ({ message, question, isError, isLoading }: Props) => {
  const [showComparison, setShowComparison] = useState(false);

  const { answer, sendMessage, isLoading: isLoadingGpt, isError: isErrorGpt } = useChatGptChat();

  useEffect(() => {
    if (showComparison && !answer) {
      sendMessage(question?.content ?? '');
    }
  }, [showComparison, answer, sendMessage, question]);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Wrapper showComparison={showComparison}>
        <ChatMessage
          message={message}
          isLoading={isLoading}
          isError={isError}
          comparasionButton={
            !isLoading && (
              <Button
                onClick={() => setShowComparison(!showComparison)}
                variant="text"
                size="sm"
                className="normal-case text-lighter-purple  hover:underline focus:ring-0 active:ring-0"
              >
                {!showComparison ? 'Show  comparison (ChatGPT)' : 'Hide comparison'}
              </Button>
            )
          }
        />
      </Wrapper>
      {showComparison && (
        <Wrapper showComparison>
          <ChatMessage
            isLoading={isLoadingGpt}
            message={answer ?? { content: '', id: '', role: 'assistant' }}
            type="chatgpt"
            isError={isErrorGpt}
          />
        </Wrapper>
      )}
    </div>
  );
};
