/* eslint-disable no-await-in-loop */
import { endpoints } from '@/app/api/endpoints';
import { useCallback, useState } from 'react';

export const useTokenUsage = (useCaseKey: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentTokenUsage, setCurrentTokenUsage] = useState(null);

  const initTokenUsage = useCallback(async () => {
    try {
      setIsLoading(true);

      await fetch(endpoints.tokenUsage, {
        method: 'POST',
        body: JSON.stringify({ useCaseKey }),
      });

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  }, [useCaseKey, setIsLoading, setIsError]);

  const getTokenUsage = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${endpoints.tokenUsage}?useCaseKey=${useCaseKey}`, {
        method: 'GET',
      });
      const data = await response.json();

      setCurrentTokenUsage(data);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  }, [useCaseKey, setIsLoading, setIsError, setCurrentTokenUsage]);

  return { getTokenUsage, currentTokenUsage, isLoading, isError, initTokenUsage };
};
