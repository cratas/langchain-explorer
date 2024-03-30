import { countTokens } from '@anthropic-ai/tokenizer';

/**
 * Calculates the number of tokens in a given text string using Anthropic's tokenizer.
 *
 * @param {string} text - The text to be tokenized.
 * @returns {number} The number of tokens in the text.
 */
export const getTokensCountAnthropic = (text: string): number => countTokens(text);
