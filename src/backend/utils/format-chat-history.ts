import { Message } from 'ai/react';

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
