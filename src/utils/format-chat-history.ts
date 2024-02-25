import { Message } from 'ai/react';

export const formatChatHistory = (chatHistory: Message[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    switch (message.role) {
      case 'user':
        return `Human: ${message.content}`;
      case 'assistant':
        return `Assistant: ${message.content}`;
      default:
        return `Initializing system message: ${message.content}`;
    }
  });

  return formattedDialogueTurns.join('\n');
};
