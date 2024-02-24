import React, { PropsWithChildren } from 'react';
import { Message } from 'ai/react';
import { ChatMessage } from './chat-message';

type Props = {
  message: Message;
};

const Wrapper = ({ children }: PropsWithChildren) => (
  <div className="w-[50%] rounded-xl border-2 border-browser-light p-3">{children}</div>
);

export const ChatMessageWithComparison = ({ message }: Props) => (
  <div className="flex gap-3">
    <Wrapper>
      <ChatMessage message={message} />
    </Wrapper>
    <Wrapper>
      <ChatMessage message={message} type="chatgpt" />
    </Wrapper>
  </div>
);
