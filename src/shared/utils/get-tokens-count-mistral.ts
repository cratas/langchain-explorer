const { MistralTokenizer } = require('mistral-tokenizer-ts');

/**
 * Calculates the number of tokens in a given text string using Mistral's tokenizer.
 *
 * @param {string} text - The text to be tokenized.
 * @returns {number} The number of tokens in the text.
 */
export const getTokensCountMistral = (text: string): number => {
  const tokenizer = new MistralTokenizer();

  const tokens = tokenizer.encode(text);

  return tokens.length;
};
