'use client';

import { UseCaseSettingsDrawer } from '@/frontend/layouts';
import React, { useEffect, useRef, useState } from 'react';
import { Spinner, Typography } from '@/frontend/components/tailwind-components';
import { useEmbedContext } from '@/frontend/hooks/use-embed-context';
import { toast } from 'react-toastify';
import { MainUseCaseViewHeader } from '@/frontend/components/common';
import { CustomChatbotPageSettingsType } from '@/frontend/types/custom-chatbot';
import { defaultValuesWithoutDefaultFile } from '@/frontend/constants/custom-chatbot';
import { CUSTOM_CHATBOT_DEFAULT_FILE_NAME } from '@/shared/constants/common';
import { CUSTOM_CHATBOT_MAIN_UC_KEY } from '@/shared/constants/use-case-keys';
import { useTokenUsage } from '@/frontend/hooks/use-token-usage';
import { CustomChatbotPageSettings } from '../custom-chatbot-page-settings';
import { CustomChatbotPageRoom } from '../custom-chatbot-page-room';
import { getSourceName } from '../utils/get-source-name';

const DEFAULT_NAVAL_EMBEDDING_TOKENS = 142394;

export const CustomChatbotPageView = () => {
  const [settingsChanged, setSettingsChanged] = useState(false);

  const [defaultFileLoaded, setDefaultFileLoaded] = useState(false);

  const { embedContext, isLoading } = useEmbedContext();

  const {
    initTokenUsage,
    getTokenUsage,
    currentTokenUsage,
    isLoading: isLoadingUsage,
  } = useTokenUsage(CUSTOM_CHATBOT_MAIN_UC_KEY);

  const [currentSettings, setCurrentSettings] = useState<CustomChatbotPageSettingsType>(
    defaultValuesWithoutDefaultFile
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsFormRef = useRef<HTMLFormElement>();

  useEffect(() => {
    const loadPdfFileAndInitTokenUsage = async () => {
      try {
        const response = await fetch('/pdf/The-Almanack-Of-Naval-Ravikant.pdf');

        const blob = await response.blob();

        const file = new File([blob], CUSTOM_CHATBOT_DEFAULT_FILE_NAME, {
          type: 'application/pdf',
        });

        setCurrentSettings({ ...defaultValuesWithoutDefaultFile, sourceFilePdf: file });

        setDefaultFileLoaded(true);
      } catch (error) {
        throw new Error('Error loading default PDF file');
      }

      await initTokenUsage();

      await getTokenUsage();
    };

    loadPdfFileAndInitTokenUsage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitButtonClick = () => settingsFormRef.current?.submit();

  const handleChangeSettings = async (data: CustomChatbotPageSettingsType) => {
    const context =
      ((data.sourceType === 'cheerio-web-scraping' || data.sourceType === 'github-repository') &&
        data.sourceUrl) ||
      (data.sourceType === 'text' && data.sourceFileTxt) ||
      data.sourceFilePdf!;

    await initTokenUsage();

    const saved = await embedContext(
      context,
      data.sourceType,
      data.chunkOverlap,
      data.chunkSize,
      data.embeddingModel,
      CUSTOM_CHATBOT_MAIN_UC_KEY,
      data.branch
    );

    if (saved) {
      await getTokenUsage();

      setCurrentSettings(data);

      toast.success('Chat set successfully.');

      setSettingsChanged(true);
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
        {defaultFileLoaded ? (
          <CustomChatbotPageSettings
            formRef={settingsFormRef}
            defaultSettings={currentSettings}
            changeSettings={handleChangeSettings}
          />
        ) : (
          <Spinner className="h-12 w-12 text-lighter-purple" />
        )}
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
          <CustomChatbotPageRoom
            {...currentSettings}
            sourceName={getSourceName(currentSettings)}
            getTokenUsage={getTokenUsage}
            currentTokenUsage={currentTokenUsage}
            isLoadingUsage={isLoadingUsage}
            defaultEmbeddingTokens={!settingsChanged ? DEFAULT_NAVAL_EMBEDDING_TOKENS : 0}
          />
        )}
      </div>
    </div>
  );
};
