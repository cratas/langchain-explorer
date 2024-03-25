'use client';

import React, { useRef, useState } from 'react';
import { Spinner, Typography } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { UseCaseSettingsDrawer } from '@/frontend/layouts';
import { MainUseCaseViewHeader } from '@/frontend/components/common';
import { ModerationPageSettings } from '../moderation-page-settings';
import { ModerationPageSettingsType, defaultValues } from '../types';
import { ModerationPageRoom } from '../moderation-page-room';

export const ModerationPageView = () => {
  const [currentSettings, setCurrentSettings] = useState<ModerationPageSettingsType>(defaultValues);

  const [settingsOpen, setSettingsOpen] = useState(false);

  // state for re-mounting whole chat component (room)
  const [roomKey, setRoomKey] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const settingsFormRef = useRef<HTMLFormElement>();

  const onSubmitButtonClick = () => settingsFormRef.current?.submit();

  const handleChangeSettings = async (data: ModerationPageSettingsType) => {
    setIsLoading(true);

    // fake loading effect
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCurrentSettings(data);

    setRoomKey((prevKey) => prevKey + 1);

    setIsLoading(false);

    toast.success('Chat set successfully.');
  };
  return (
    <div className="flex h-screen">
      <UseCaseSettingsDrawer
        open={settingsOpen}
        setOpen={setSettingsOpen}
        onSubmitButtonClick={onSubmitButtonClick}
      >
        <ModerationPageSettings
          formRef={settingsFormRef}
          defaultSettings={currentSettings}
          changeSettings={handleChangeSettings}
        />
      </UseCaseSettingsDrawer>

      <div className="flex h-screen w-full flex-col">
        <MainUseCaseViewHeader openMenu={() => setSettingsOpen(!settingsOpen)} />

        {isLoading ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 md:gap-4">
            <Spinner className="h-12 w-12 text-lighter-purple" />
            <Typography className="font-bold text-text-primary">
              Initializing new chat ...
            </Typography>
          </div>
        ) : (
          <ModerationPageRoom key={roomKey} {...currentSettings} />
        )}
      </div>
    </div>
  );
};
