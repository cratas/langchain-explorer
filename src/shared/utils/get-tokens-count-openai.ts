import { encode } from 'gpt-tokenizer';

/**
 * Calculates the number of tokens in a given text string using OpenAI's GPT tokenizer.
 *
 * @param {string} text - The text to be tokenized.
 * @returns {number} The number of tokens in the text.
 */
export const getTokensCountOpenAI = (text: string): number => encode(text).length;
