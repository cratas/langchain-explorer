'use client';

import { UseCaseSettingsDrawer } from '@/frontend/layouts';
import React, { useRef, useState } from 'react';
import { Spinner, Typography } from '@/frontend/components/tailwind-components';
import { useEmbedContext } from '@/frontend/hooks/use-embed-context';
import { toast } from 'react-toastify';
import { MainUseCaseViewHeader } from '@/frontend/components/common';
import { CustomChatbotPageSettingsType } from '@/frontend/types/custom-chatbot';
import { defaultValues } from '@/frontend/constants/custom-chatbot';
import { CustomChatbotPageSettings } from '../custom-chatbot-page-settings';
import { CustomChatbotPageRoom } from '../custom-chatbot-page-room';
import { getSourceName } from '../utils/get-source-name';

export const CustomChatbotPageView = () => {
  const { embedContext, isLoading } = useEmbedContext();

  const [currentSettings, setCurrentSettings] =
    useState<CustomChatbotPageSettingsType>(defaultValues);

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
        <MainUseCaseViewHeader
          openMenu={() => setSettingsOpen(!settingsOpen)}
          sourceName={getSourceName(currentSettings)}
        />

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
