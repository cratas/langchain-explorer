import { Button } from '@material-tailwind/react';
import React from 'react';

type Props = {
  initializeChatbot: VoidFunction;
};

export const InitChatbot = ({ initializeChatbot }: Props) => (
  <div className="flex flex-col items-center">
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-text-light">{`Let's start a conversation`}</h1>
      <h6 className="text-md mt-2 font-normal text-text-primary">
        Chat with with Q&A ChatBot (RAG) about The Almanack of Naval Ravikant book (PDF).
      </h6>
    </div>

    <Button
      size="sm"
      onClick={initializeChatbot}
      className="flex h-full items-center rounded bg-lighter-purple hover:bg-light-purple"
    >
      Start Chatting
    </Button>
  </div>
);
