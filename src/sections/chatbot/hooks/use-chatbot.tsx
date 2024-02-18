import { paths } from '@/app/api/endpoints';
import { Message } from '@/types/chat';
import { useState } from 'react';

export const useChatBot = (context: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const askChatBot = async (message: string, history: Message[]): Promise<Response | null> => {
    try {
      setIsLoading(true);
      setIsError(false);

      const response = await fetch(paths.customChatbot, {
        method: 'POST',
        body: JSON.stringify({ message, history, context }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsLoading(false);

      return await response.json();
    } catch (error) {
      setIsLoading(false);
      setIsError(true);

      return null;
    }
  };

  return { isLoading, isError, askChatBot };
};
