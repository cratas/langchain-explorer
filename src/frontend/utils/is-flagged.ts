import { Message } from 'ai';

/**
 * Checks if a message is flagged.
 *
 * @param {Message} message - The message to check.
 * @returns {boolean} A boolean indicating if the message is flagged.
 */
export const isFlagged = (message: Message): boolean => {
  try {
    const { flagged } = JSON.parse(message.content);

    return flagged;
  } catch {
    return false;
  }
};
