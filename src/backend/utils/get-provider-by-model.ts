import {
  ChatLLMProvider,
  ConversationModelOptions,
  EmbeddingLLMProvider,
  EmbeddingModelOptions,
} from '@/shared/types/common';

const openaiModels = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125',
  'text-embedding-ada-002',
  'text-embedding-3-small',
  'text-embedding-3-large',
];
const mistralModels = [
  'mistral-large-2402',
  'mistral-medium-2312',
  'mistral-small-2402',
  'mistral-embed',
];
const claudeModels = [
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
];

export const getProviderByModelName = (
  modelName: ConversationModelOptions | EmbeddingModelOptions
): EmbeddingLLMProvider | ChatLLMProvider => {
  if (openaiModels.includes(modelName)) {
    return 'openai';
  }
  if (mistralModels.includes(modelName)) {
    return 'mistral';
  }
  if (claudeModels.includes(modelName)) {
    return 'anthropic';
  }

  throw new Error('Model not found');
};
