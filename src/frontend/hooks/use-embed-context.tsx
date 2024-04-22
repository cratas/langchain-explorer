import { endpoints } from '@/app/api/endpoints';
import { EmbeddingModelOptions, SourceOptions, UseCaseKey } from '@/shared/types/common';
import { useState } from 'react';

/**
 * A hook for handling the embedding of text or PDF content.
 * Manages loading state, error state, and success state of the embedding process.
 */
export const useEmbedContext = () => {
  const [contextSaved, setContextSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const embedContext = async (
    context: File | string,
    sourceType: SourceOptions,
    chunkOverlap: number,
    chunkSize: number,
    model: EmbeddingModelOptions,
    useCaseKey: UseCaseKey,
    branch: string
  ): Promise<boolean> => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append('sourceType', sourceType);
    formData.append('chunkSize', String(chunkSize));
    formData.append('chunkOverlap', String(chunkOverlap));
    formData.append('embeddingModel', model);
    formData.append('useCaseKey', useCaseKey);
    formData.append('branch', branch);

    if (sourceType === 'pdf' || sourceType === 'text') {
      formData.append('file', context);
      formData.append('fileName', (context as File).name);
    } else {
      formData.append('url', context);
      formData.append('fileName', context);
    }

    const response = await fetch(endpoints.pinecone.saveContext, {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false);

    if (response.status === 201) {
      setContextSaved(true);
      return true;
    }

    if (response.status === 500) {
      setIsError(true);
      return false;
    }

    return false;
  };

  return { contextSaved, isLoading, isError, embedContext };
};
