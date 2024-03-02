import {
  MODERATION_SYSTEM_MESSAGE_NO_COMPETITION,
  MODERATION_SYSTEM_MESSAGE_NO_FINANCE_ADVICES,
  MODERATION_SYSTEM_MESSAGE_YOUTH_AUDIENCE,
} from '@/constants/moderation';

enum OptionsEnum {
  YOUTH_AUDIENCE = 'youth_audience',
  APPLE_PRODUCTS_SUPPORT = 'apple_products_support',
  TRADING_PLATFORM = 'trading_platform',
}

export const OPTIONS: ModerationUseCase[] = [
  {
    label: 'Youth Audience',
    value: OptionsEnum.YOUTH_AUDIENCE,
    systemMessage: MODERATION_SYSTEM_MESSAGE_YOUTH_AUDIENCE,
    description:
      'Chat is set up to answer to youth audience with an emphasis on simplicity and educational content. Chat is also set up to filter out anything that is potentially harmful.',
  },
  {
    label: 'Apple products support',
    value: OptionsEnum.APPLE_PRODUCTS_SUPPORT,
    systemMessage: MODERATION_SYSTEM_MESSAGE_NO_COMPETITION,
    description:
      'Chat is set up to answer without mentioning competitors. Chat is also set up to filter out anything that is potentially harmful.',
  },
  {
    label: 'Trading platform',
    value: OptionsEnum.TRADING_PLATFORM,
    systemMessage: MODERATION_SYSTEM_MESSAGE_NO_FINANCE_ADVICES,
    description:
      'Chat is also set up to answer without giving financial advice. Chat is also set up to filter out anything that is potentially harmful. ',
  },
];

export type ModerationUseCase = {
  label: string;
  value: OptionsEnum;
  description: string;
  systemMessage: string;
};
