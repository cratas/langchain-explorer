import { Message } from 'ai';

export const isFlagged = (message: Message): boolean => {
  try {
    const { flagged } = JSON.parse(message.content);

    return flagged;
  } catch {
    return false;
  }
};
