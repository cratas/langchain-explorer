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

/**
 * Determines the appropriate provider for a given model name.
 * This function maps model names to their respective providers (e.g., OpenAI, Mistral, Anthropic).
 * It checks if the provided model name belongs to a known set of models for each provider
 * and returns the corresponding provider name.
 *
 * @param {ConversationModelOptions | EmbeddingModelOptions} modelName - The name of the model for which the provider is to be determined.
 * @returns {EmbeddingLLMProvider | ChatLLMProvider} The provider name corresponding to the given model name.
 * @throws {Error} Throws an error if the model name does not match any known provider's model list.
 */
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
