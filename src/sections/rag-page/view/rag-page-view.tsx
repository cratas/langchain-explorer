'use client';

import { UseCaseSettingsDrawer } from '@/layouts';
import React, { useRef, useState } from 'react';
import { Button, IconButton, Typography } from '@material-tailwind/react';
import routes from '@/app/routes';
import { useResponsive } from '@/hooks/use-responsive';
import { RagPageSettings } from '../rag-page-settings';
import { RagPageRoom } from '../rag-page-room';

export const RagPageView = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isSmallDevice = useResponsive('down', 'lg');

  const ragFormRef = useRef<HTMLFormElement>();

  const onSubmitButtonClick = () => ragFormRef.current?.submit();

  return (
    <div className="flex h-screen">
      <UseCaseSettingsDrawer
        open={settingsOpen}
        setOpen={setSettingsOpen}
        onSubmitButtonClick={onSubmitButtonClick}
      >
        <RagPageSettings formRef={ragFormRef} />
      </UseCaseSettingsDrawer>

      <div className="flex w-full flex-col">
        <div className="m-3 flex items-center justify-between border-b-2 border-browser-light pb-3">
          {isSmallDevice && (
            <IconButton
              placeholder=""
              className="mr-2 bg-lighter-purple"
              size="sm"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <div className="flex items-center justify-center">
                <span className="icon-[majesticons--menu-expand-right] text-3xl" />
              </div>
            </IconButton>
          )}

          <Typography placeholder="" className="font-bold">
            RAG Chatbot
          </Typography>

          <a href={routes.home} className="ml-auto">
            <Button
              className="flex items-center gap-2 text-text-light hover:text-text-primary"
              placeholder=""
              size="sm"
            >
              <span className="icon-[fluent--home-24-filled] text-lg" />
              Home
            </Button>
          </a>
        </div>

        <RagPageRoom fileName="sdf" systemMessage="" />
      </div>
    </div>
  );
};
