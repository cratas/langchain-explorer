export const EXAMPLE_INPUTS = [
  'Who is the customer of March 2024?',
  'What is status of my latest order?',
  'What are 3 the most popular products in Toys category?',
  'What is the most popular product all the time?',

  'What are the best-selling books this month?',
  'Which electronic products have the best reviews currently?',
  'Can I see a list of the newest additions in the home appliances section?',
  'What are the most purchased products by users in my age group?',
  'Which clothing brand has been the most popular this season?',
  'Can you suggest the top five products in the outdoor gear category?',
  'What are the trending items in the fitness equipment section?',
  'Could you recommend the best-sellers in the kitchen gadgets range?',
];

const createSystemMessage = (role: 'user' | 'guest' | 'administrator', username?: string) =>
  `You are customer support assistant for an e-shop. Your role is to assist users with product-related queries. User role is ${role} and logged user's name is ${username}, consider it in creating parameters for function calls which will be used in the chat.`;

export const SYSTEM_MESSAGE_GUEST = createSystemMessage('guest');
export const SYSTEM_MESSAGE_USER = createSystemMessage('user', 'Roland Schimmel');
export const SYSTEM_MESSAGE_ADMINISTRATOR = createSystemMessage('administrator');
