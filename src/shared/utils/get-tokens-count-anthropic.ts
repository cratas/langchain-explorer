import { Tiktoken, TiktokenBPE } from 'js-tiktoken';
import claude from '../../../claude.json';

// anthropic-tokenizer-typescript not supported on Vercel Serverless and Edge
// https://github.com/anthropics/anthropic-tokenizer-typescript/issues/6
// ---------------------------------------------------------------------------
// Modified from: https://github.com/anthropics/anthropic-tokenizer-typescript
// (they use an old version of Tiktoken that isn't edge compatible)
export function countTokens(text: string): number {
  const tokenizer = getTokenizer();
  const encoded = tokenizer.encode(text.normalize('NFKC'), 'all');
  return encoded.length;
}
const getTokenizer = (): Tiktoken => {
  const ranks: TiktokenBPE = {
    bpe_ranks: claude.bpe_ranks,
    special_tokens: claude.special_tokens,
    pat_str: claude.pat_str,
  };
  return new Tiktoken(ranks);
};

/**
 * Calculates the number of tokens in a given text string using Anthropic's tokenizer.
 *
 * @param {string} text - The text to be tokenized.
 * @returns {number} The number of tokens in the text.
 */
export const getTokensCountAnthropic = (text: string): number => countTokens(text);
