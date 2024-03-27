import { EmbeddingModelOptions, SourceOptions } from '@/shared/types/common';

export const validateRequestAndGetFormData = (formData: FormData) => {
  const embeddingModel = formData.get('embeddingModel') as EmbeddingModelOptions;
  const sourceType = formData.get('sourceType') as SourceOptions;
  const chunkSize = formData.get('chunkSize') as string;
  const chunkOverlap = formData.get('chunkOverlap') as string;
  const fileName = formData.get('fileName');
  const url = formData.get('url');
  const file = formData.get('file') as Blob;

  if (!chunkSize || !chunkOverlap) {
    throw new Error('Missing Chunk size or Chunk overlap');
  }

  if (sourceType === 'pdf' || sourceType === 'text') {
    if (!file) {
      throw new Error('Missing Context file');
    }
  }

  if (sourceType === 'cheerio-web-scraping' || sourceType === 'github-repository') {
    if (!url) {
      throw new Error('Missing Source URL');
    }
  }

  return {
    embeddingModel,
    sourceType,
    chunkSize,
    chunkOverlap,
    fileName,
    url,
    file,
  };
};
