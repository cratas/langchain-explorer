import { Message } from 'ai/react';

/**
 * Formats the chat history into a dialogue format.
 * This function converts an array of message objects into a string,
 * where each message is prefixed by the role (e.g., 'Human' or 'Assistant') and
 * followed by the message content. The messages are separated by new lines for clarity.
 *
 * @param {Message[]} chatHistory - An array of message objects, each representing a turn in the chat history.
 * @returns {string} The formatted chat history as a single string, suitable for display or further processing.
 */

export const formatChatHistory = (chatHistory: Message[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    switch (message.role) {
      case 'user':
        return `Human: ${message.content}\n`;
      case 'assistant':
        return `Assistant: ${message.content}\n`;
      default:
        return `Initializing system message: ${message.content}\n`;
    }
  });

  return formattedDialogueTurns.join('\n');
};
