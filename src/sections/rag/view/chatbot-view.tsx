'use client';

import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { BrowserLayout } from '@/layouts';
import { DEFAULT_SYSTEM_MESSAGE } from '@/constants/custom-chatbot';
import { ChatBotRoom } from '../chatbot-room';
import { ChatBotViewHeader } from '../chatbot-view-header';

export const ChatBotView = () => {
  const [initialized, setInitialized] = useState(false);

  const renderInitChatbot = (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-light">{`Let's start a conversation`}</h1>
        <h6 className="text-md mt-2 font-normal text-text-primary">
          Chat with with Q&A ChatBot (RAG) about The Almanack of Naval Ravikant book (PDF).
        </h6>
      </div>

      <Button
        size="sm"
        onClick={() => setInitialized(true)}
        className="flex h-full items-center rounded bg-lighter-purple hover:bg-light-purple"
      >
        Start Chatting
      </Button>
    </div>
  );

  return (
    <>
      <ChatBotViewHeader />

      <BrowserLayout>
        <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
          {initialized ? (
            <ChatBotRoom
              fileName="The Almanack of Naval Ravikant.pdf"
              systemMessage={DEFAULT_SYSTEM_MESSAGE}
            />
          ) : (
            renderInitChatbot
          )}
        </div>
      </BrowserLayout>
    </>
  );
};
