'use client';

import { UseCaseSettingsDrawer } from '@/layouts';
import { ChatBotRoom } from '@/sections/rag/chatbot-room';
import { IconButton } from '@material-tailwind/react';
import React, { useState } from 'react';

export const RagPageView = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <UseCaseSettingsDrawer open={settingsOpen} setOpen={setSettingsOpen} />

      <div className="flex w-full flex-col">
        <div>
          {' '}
          <IconButton placeholder="" onClick={() => setSettingsOpen((prev) => !prev)}>
            <span className="icon-[solar--alt-arrow-right-line-duotone]" />
          </IconButton>
        </div>

        <ChatBotRoom onBack={() => {}} fileName="sdf" systemMessage="" />
      </div>
    </div>
  );
};
