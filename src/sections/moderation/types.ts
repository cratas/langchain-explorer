import {
  SYSTEM_MESSAGE_NO_COMPETITION,
  SYSTEM_MESSAGE_NO_FINANCE_ADVICES,
  SYSTEM_MESSAGE_YOUTH_AUDIENCE,
} from '@/constants/moderation';

export const OPTIONS: ModerationUseCase[] = [
  {
    label: 'Youth Audience',
    value: 'youth_audience',
    systemMessage: SYSTEM_MESSAGE_YOUTH_AUDIENCE,
    description:
      'Chat is set up to answer to youth audience with an emphasis on simplicity and educational content. Chat is also set up to filter out anything that is potentially harmful.',
  },
  {
    label: 'Apple products support',
    value: 'apple_products_support',
    systemMessage: SYSTEM_MESSAGE_NO_COMPETITION,
    description:
      'Chat is set up to answer without mentioning competitors. Chat is also set up to filter out anything that is potentially harmful.',
  },
  {
    label: 'Trading platform',
    value: 'trading_platform',
    systemMessage: SYSTEM_MESSAGE_NO_FINANCE_ADVICES,
    description:
      'Chat is also set up to answer without giving financial advice. Chat is also set up to filter out anything that is potentially harmful. ',
  },
];

export type ModerationUseCase = {
  label: string;
  value: 'youth_audience' | 'apple_products_support' | 'trading_platform';
  description: string;
  systemMessage: string;
};
