'use client';

import { UseCaseSettingsDrawer } from '@/layouts';
import React, { useRef, useState } from 'react';
import { useResponsive } from '@/hooks/use-responsive';
import { Button, IconButton, Spinner, Typography } from '@material-tailwind/react';
import routes from '@/app/routes';
import { ModerationPageSettings } from '../moderation-page-settings';
import { ModerationPageSettingsType, defaultValues } from '../types';

export const ModerationPageView = () => {
  const isSmallDevice = useResponsive('down', 'lg');

  const [currentSettings, setCurrentSettings] = useState<ModerationPageSettingsType>(defaultValues);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const isLoading = false;

  const settingsFormRef = useRef<HTMLFormElement>();

  const onSubmitButtonClick = () => settingsFormRef.current?.submit();

  const handleChangeSettings = (data: unknown) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen">
      <UseCaseSettingsDrawer open={settingsOpen} setOpen={setSettingsOpen}>
        <ModerationPageSettings
          formRef={settingsFormRef}
          defaultSettings={currentSettings}
          changeSettings={handleChangeSettings}
        />
      </UseCaseSettingsDrawer>

      <div className="flex h-screen w-full flex-col">
        <div className="m-3 flex items-center justify-between border-b-2 border-browser-light pb-3">
          {isSmallDevice && (
            <IconButton
              className="mr-2 bg-lighter-purple"
              size="sm"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <div className="flex items-center justify-center">
                <span className="icon-[majesticons--menu-expand-right] text-3xl" />
              </div>
            </IconButton>
          )}

          {/* <Typography className="font-bold">{getSourceName(currentSettings)}</Typography> */}

          <a href={routes.home} className="ml-auto">
            <Button
              className="flex items-center gap-2 text-text-light hover:text-text-primary"
              size="sm"
            >
              <span className="icon-[fluent--home-24-filled] text-lg" />
              Home
            </Button>
          </a>
        </div>

        {isLoading ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 md:gap-4">
            <Spinner className="h-12 w-12 text-lighter-purple" />
            <Typography className="font-bold text-text-primary">Embedding ...</Typography>
          </div>
        ) : (
          <div />
          // <CustomChatbotPageRoom {...currentSettings} sourceName={getSourceName(currentSettings)} />
        )}
      </div>
    </div>
  );
};
