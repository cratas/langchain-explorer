import { describe, expect, it } from 'vitest';
import { ConversationModelOptions, EmbeddingModelOptions } from '@/shared/types/common';
import { getProviderByModelName } from '../get-provider-by-model';

describe('getProviderByModelName', () => {
  it('should return openai for openai models', () => {
    const openaiModels = [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0125',
      'text-embedding-ada-002',
      'text-embedding-3-small',
      'text-embedding-3-large',
    ];

    openaiModels.forEach((modelName) => {
      expect(
        getProviderByModelName(modelName as ConversationModelOptions | EmbeddingModelOptions)
      ).toBe('openai');
    });
  });

  it('should return mistral for mistral models', () => {
    const mistralModels = [
      'mistral-large-2402',
      'mistral-medium-2312',
      'mistral-small-2402',
      'mistral-embed',
    ];

    mistralModels.forEach((modelName) => {
      expect(
        getProviderByModelName(modelName as ConversationModelOptions | EmbeddingModelOptions)
      ).toBe('mistral');
    });
  });

  it('should return anthropic for claude models', () => {
    const claudeModels = [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];

    claudeModels.forEach((modelName) => {
      expect(
        getProviderByModelName(modelName as ConversationModelOptions | EmbeddingModelOptions)
      ).toBe('anthropic');
    });
  });

  it('should throw an error for unknown models', () => {
    expect(() =>
      getProviderByModelName('unknown-model' as ConversationModelOptions | EmbeddingModelOptions)
    ).toThrowError('Model not found');
  });
});
