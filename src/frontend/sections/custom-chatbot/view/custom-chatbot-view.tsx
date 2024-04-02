'use client';

import React, { useState } from 'react';
import { BrowserLayout } from '@/frontend/layouts';
import { DEFAULT_SYSTEM_MESSAGE } from '@/frontend/constants/custom-chatbot';
import { CUSTOM_CHATBOT_DEFAULT_FILE_NAME } from '@/shared/constants/common';
import { CustomChatBotRoom } from '../custom-chatbot-room';
import { CustomChatBotViewHeader } from '../custom-chatbot-view-header';
import { CustomChatbotInit } from '../custom-chatbot-init';

export const CustomChatBotView = () => {
  const [initialized, setInitialized] = useState(false);

  return (
    <>
      <CustomChatBotViewHeader />

      <BrowserLayout>
        <div className="flex h-[50rem] flex-col items-center justify-center bg-background-dark p-3">
          {initialized ? (
            <CustomChatBotRoom
              fileName={CUSTOM_CHATBOT_DEFAULT_FILE_NAME}
              systemMessage={DEFAULT_SYSTEM_MESSAGE}
            />
          ) : (
            <CustomChatbotInit initializeChatbot={() => setInitialized(true)} />
          )}
        </div>
      </BrowserLayout>
    </>
  );
};
