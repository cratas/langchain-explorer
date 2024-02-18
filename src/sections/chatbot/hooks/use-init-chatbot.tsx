import { paths } from '@/app/api/endpoints';
import { useState } from 'react';

export const useInitChatbot = () => {
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const initializeChatBot = async (contextFile: File) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', contextFile);
    formData.append('fileName', contextFile.name);

    const response = await fetch(paths.pinecone.saveContext, {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false);

    if (response.status === 201) {
      setInitialized(true);
    } else if (response.status === 500) {
      setIsError(true);
    }
  };

  return { initialized, isLoading, isError, initializeChatBot, setInitialized };
};
