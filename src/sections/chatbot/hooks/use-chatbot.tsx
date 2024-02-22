import { paths } from '@/app/api/endpoints';
import { Message } from '@/types/chat';
import { useState } from 'react';

export const useChatBot = (context: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isLoadingOpenAI, setIsLoadingOpenAI] = useState(false);
  const [isErrorOpenAI, setIsErrorOpenAI] = useState(false);

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

  const askOpenAI = async (message: string): Promise<Response | null> => {
    try {
      setIsLoadingOpenAI(true);
      setIsErrorOpenAI(false);

      const response = await fetch(paths.openAI, {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsLoadingOpenAI(false);

      const jsonResponse = await response.json();

      const {
        content: { choices },
      } = jsonResponse ?? {};

      return choices?.[0]?.message?.content;
    } catch (error) {
      setIsLoadingOpenAI(false);
      setIsErrorOpenAI(true);

      return null;
    }
  };

  return {
    isLoading: isLoading || isLoadingOpenAI,
    isError: isError || isErrorOpenAI,
    askChatBot,
    askOpenAI,
  };
};
