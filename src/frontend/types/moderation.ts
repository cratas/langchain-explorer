import { ConversationModelOptions } from '@/shared/types/common';

export type ModerationUseCase = {
  label: string;
  value: 'youth_audience' | 'apple_products_support' | 'trading_platform';
  description: string;
  systemMessage: string;
};

export type ModerationPageSettingsType = {
  conversationModel: ConversationModelOptions;
  conversationTemperature: number;
  minScore: number;
  systemMessage: string;
  categories: {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    'self-harm': boolean;
    'sexual/minors': boolean;
    'hate/threatening': boolean;
    'violence/graphic': boolean;
    'self-harm/intent': boolean;
    'self-harm/instructions': boolean;
    'harassment/threatening': boolean;
    violence: boolean;
  };
};
