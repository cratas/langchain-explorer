'use client';

import { UseCaseSettingsDrawer } from '@/layouts';
import React, { useRef, useState } from 'react';
import { Button, IconButton, Spinner, Typography } from '@material-tailwind/react';
import { useResponsive } from '@/hooks/use-responsive';
import { useEmbedContext } from '@/hooks/use-embed-context';
import { toast } from 'react-toastify';
import routes from '@/app/routes';
import { CustomChatbotPageSettings } from '../custom-chatbot-page-settings';
import { CustomChatbotPageRoom } from '../custom-chatbot-page-room';
import { defaultValues } from '../constants';
import { CustomChatbotPageSettingsType } from '../types';
import { getSourceName } from '../utils/get-source-name';

export const CustomChatbotPageView = () => {
  const { embedContext, isLoading } = useEmbedContext();

  const [currentSettings, setCurrentSettings] =
    useState<CustomChatbotPageSettingsType>(defaultValues);

  const isSmallDevice = useResponsive('down', 'lg');

  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsFormRef = useRef<HTMLFormElement>();

  const onSubmitButtonClick = () => settingsFormRef.current?.submit();

  const handleChangeSettings = async (data: CustomChatbotPageSettingsType) => {
    const context =
      ((data.sourceType === 'cheerio-web-scraping' || data.sourceType === 'github-repository') &&
        data.sourceUrl) ||
      (data.sourceType === 'text' && data.sourceFileTxt) ||
      data.sourceFilePdf!;

    const saved = await embedContext(
      context,
      data.sourceType,
      data.chunkOverlap,
      data.chunkSize,
      data.embeddingModel
    );

    if (saved) {
      setCurrentSettings(data);

      toast.success('Chat set successfully.');
    } else {
      toast.error('Something went wrong, try set chat again.');
    }
  };

  return (
    <div className="flex h-screen">
      <UseCaseSettingsDrawer
        open={settingsOpen}
        setOpen={setSettingsOpen}
        onSubmitButtonClick={onSubmitButtonClick}
      >
        <CustomChatbotPageSettings
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

          <Typography className="font-bold">{getSourceName(currentSettings)}</Typography>

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
          <CustomChatbotPageRoom {...currentSettings} sourceName={getSourceName(currentSettings)} />
        )}
      </div>
    </div>
  );
};
