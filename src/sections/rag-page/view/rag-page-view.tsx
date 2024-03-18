'use client';

import { UseCaseSettingsDrawer } from '@/layouts';
import React, { useState } from 'react';
import { SettingsDrawerButton } from '@/components/settings-drawer';
import { useResponsive } from '@/hooks/use-responsive';
import { Button, Typography } from '@material-tailwind/react';
import routes from '@/app/routes';
import { RagPageRoom } from '../rag-page-room';

export const RagPageView = () => {
  const isSmallDevice = useResponsive('down', 'lg');

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <UseCaseSettingsDrawer open={settingsOpen} setOpen={setSettingsOpen}>
        sdf
      </UseCaseSettingsDrawer>

      <div className="flex w-full flex-col">
        <div className="m-3 flex items-center justify-between border-b-2 border-browser-light pb-3">
          {isSmallDevice && <SettingsDrawerButton onClick={() => setSettingsOpen(!settingsOpen)} />}

          <Typography placeholder="" className="font-bold">
            RAG ChatBot
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
