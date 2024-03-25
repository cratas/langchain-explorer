import { Message } from 'ai';

export const getDataFromFlaggedMessage = (message: Message) => {
  try {
    return JSON.parse(message.content);
  } catch {
    throw new Error('Invalid message content');
  }
};
