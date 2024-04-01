import { ChatLLMProvider } from '../types/common';
import { getTokensCountAnthropic } from './get-tokens-count-anthropic';
import { getTokensCountMistral } from './get-tokens-count-mistral';
import { getTokensCountOpenAI } from './get-tokens-count-openai';

/**
 * Get the number of tokens in a given text string based on the LLM provider.
 * @param llmProvider The LLM provider to use.
 * @param text The text to count tokens from.
 * @returns The number of tokens in the text.
 */
export const getTokensCountByLLMProvider = (llmProvider: ChatLLMProvider, text: string): number => {
  switch (llmProvider) {
    case 'mistral':
      return getTokensCountMistral(text);
    case 'anthropic':
      return getTokensCountAnthropic(text);
    case 'openai':
      return getTokensCountOpenAI(text);
    default:
      throw new Error(`Unsupported LLM provider: ${llmProvider}`);
  }
};
