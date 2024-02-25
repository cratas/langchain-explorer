import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Message } from 'ai/react';
import { Button } from '@material-tailwind/react';
import { useChatGptChat } from '@/hooks/use-chat-gpt-chat';
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
    className={`${showComparison ? 'w-[50%]' : 'w-full'} rounded-xl border-2 border-browser-light p-3`}
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
    <div className="flex gap-3">
      <Wrapper showComparison={showComparison}>
        <ChatMessage
          message={message}
          isLoading={isLoading}
          isError={isError}
          comparasionButton={
            !isLoading && (
              <Button
                placeholder=""
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
