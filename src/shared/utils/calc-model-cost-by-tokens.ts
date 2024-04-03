import { ConversationModelOptions, EmbeddingModelOptions } from '../types/common';

type TokenPrice = { [key in ConversationModelOptions | EmbeddingModelOptions]: number };

// price sources:
// https://www.anthropic.com/api
// https://docs.mistral.ai/platform/pricing/
// https://www.openai.com/pricing/
const PRICE_BY_TOKEN: {
  input: TokenPrice;
  output: TokenPrice;
} = {
  input: {
    'gpt-3.5-turbo': 0.0000005,
    'gpt-3.5-turbo-0125': 0.0000005,
    'mistral-large-2402': 0.000008,
    'mistral-medium-2312': 0.0000027,
    'mistral-small-2402': 0.000002,
    'claude-3-opus-20240229': 0.000015,
    'claude-3-sonnet-20240229': 0.000003,
    'claude-3-haiku-20240307': 0.00000025,
    // -------------------------------------
    'mistral-embed': 0.0000001,
    'text-embedding-3-large': 0.00000013,
    'text-embedding-3-small': 0.00000002,
    'text-embedding-ada-002': 0.0000001,
  },
  output: {
    'gpt-3.5-turbo': 0.0000015,
    'gpt-3.5-turbo-0125': 0.0000015,
    'mistral-large-2402': 0.000024,
    'mistral-medium-2312': 0.0000081,
    'mistral-small-2402': 0.000002,
    'claude-3-opus-20240229': 0.000075,
    'claude-3-sonnet-20240229': 0.000015,
    'claude-3-haiku-20240307': 0.00000125,
    'mistral-embed': 0.0000001,
    'text-embedding-3-large': 0.00000013,
    'text-embedding-3-small': 0.00000002,
    'text-embedding-ada-002': 0.0000001,
  },
};

/**
 * Calculate the cost of a model based on the number of tokens.
 * @param tokensCount Number of tokens
 * @param model LLM model name
 * @param type Type of token (input or output)
 * @returns Price in dollars (USD)
 */
export const calcModelCostByTokens = (
  tokensCount: number,
  model: ConversationModelOptions | EmbeddingModelOptions,
  type: 'input' | 'output'
): number => tokensCount * PRICE_BY_TOKEN[type][model];
