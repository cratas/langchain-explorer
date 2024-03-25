import { CustomChatbotPageSettingsType } from '@/frontend/types/custom-chatbot';

export const getSourceName = (settings: CustomChatbotPageSettingsType): string => {
  if (
    settings.sourceType === 'cheerio-web-scraping' ||
    settings.sourceType === 'github-repository'
  ) {
    return settings.sourceUrl as string;
  }

  if (settings.sourceType === 'pdf') {
    return settings?.sourceFilePdf?.name as string;
  }

  if (settings.sourceType === 'text') {
    return settings?.sourceFileTxt?.name as string;
  }

  throw new Error('Invalid source type');
};
