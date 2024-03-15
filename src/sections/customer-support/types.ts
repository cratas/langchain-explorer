import {
  SYSTEM_MESSAGE_ADMINISTRATOR,
  SYSTEM_MESSAGE_GUEST,
  SYSTEM_MESSAGE_USER,
} from '@/constants/customer-support';

export const OPTIONS: CustomerSupportUseCase[] = [
  {
    label: 'E-shop Administrator',
    value: 'administrator',
    systemMessage: SYSTEM_MESSAGE_ADMINISTRATOR,
    description:
      'When this role is selected, the chat will be set to answer all queries related to the eshop domain.',
  },
  {
    label: 'Logged User (Roland Schimmel)',
    value: 'user',
    systemMessage: SYSTEM_MESSAGE_USER,
    description:
      "The chat will be set up to answer the user's (Roland Schimmel) questions regarding only his orders and basic information.",
  },
  {
    label: 'Guest User',
    value: 'guest',
    systemMessage: SYSTEM_MESSAGE_GUEST,
    description:
      "The chat will be set up to answer the not logged-in user's questions regarding only basic information.",
  },
];

export type CustomerSupportUseCase = {
  label: string;
  value: 'administrator' | 'guest' | 'user';
  description: string;
  systemMessage: string;
};
