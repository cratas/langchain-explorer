import { CustomerSupportUseCase } from '../types/customer-support';

export const EXAMPLE_INPUTS = [
  'Who is the customer of March 2024?',
  'What is status of my latest order?',
  'What are the 3 most popular products in Toys category?',
  'What is the most popular product all the time?',
  'Are there any products that are close to being out of stock?',
  'Find all shipped orders.',
  'Are there any orders that are not delivered yet?',
];

const createSystemMessage = (role: 'user' | 'guest' | 'administrator', username?: string) =>
  `You are customer support assistant for an e-shop. Your role is to assist users with product-related queries. User role is ${role} and logged user's name is ${username}, consider it in creating parameters for function calls which will be used in the chat.`;

export const SYSTEM_MESSAGE_GUEST = createSystemMessage('guest');
export const SYSTEM_MESSAGE_USER = createSystemMessage('user', 'Roland Schimmel');
export const SYSTEM_MESSAGE_ADMINISTRATOR = createSystemMessage('administrator');

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
