import {
  MODERATION_SYSTEM_MESSAGE_NO_COMPETITION,
  MODERATION_SYSTEM_MESSAGE_YOUTH_AUDIENCE,
} from '@/constants/moderation';

export const OPTIONS: CustomerSupportUseCase[] = [
  {
    label: 'E-shop Administrator',
    value: 'administrator',
    systemMessage: MODERATION_SYSTEM_MESSAGE_YOUTH_AUDIENCE,
    description:
      'When this role is selected, the chat will be set to answer all queries related to the eshop domain.',
  },
  {
    label: 'User (Roland Schimmel)',
    value: 'user',
    systemMessage: MODERATION_SYSTEM_MESSAGE_NO_COMPETITION,
    description:
      "The chat will be set up to answer the user's (Roland Schimmel) questions regarding only his orders and basic information.",
  },
];

export type CustomerSupportUseCase = {
  label: string;
  value: 'administrator' | 'user';
  description: string;
  systemMessage: string;
};
