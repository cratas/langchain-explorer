import { LLMResult } from '@langchain/core/outputs';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { getTokensCountMistral } from '@/shared/utils/get-tokens-count-mistral';
import { getTokensCountAnthropic } from '@/shared/utils/get-tokens-count-anthropic';
import { ModelOptions } from '../types/token-usage';
import { logger } from '../../../logger';

/**
 * Class for handling the token usage across different Language Model (LLM) implementations.
 * It provides functionalities to calculate and store the total number of tokens used in prompts
 * and completions for various LLMs such as OpenAI, Anthropics, and MistralAI.
 */
export class TokenUsageTracker {
  /**
   * Holds the total number of prompt tokens used across all LLMs.
   */
  private _totalPromptTokens = 0;

  /**
   * Holds the total number of completion tokens used across all LLMs.
   */
  private _totalCompletionTokens = 0;

  /**
   * Gets the total number of prompt tokens used.
   * @returns {number} The total prompt tokens.
   */
  get totalPromptTokens(): number {
    return this._totalPromptTokens;
  }

  /**
   * Gets the total number of completion tokens used.
   * @returns {number} The total completion tokens.
   */
  get totalCompletionTokens(): number {
    return this._totalCompletionTokens;
  }

  /**
   * Calculates the total number of tokens (both prompt and completion).
   * @returns {number} The sum of prompt and completion tokens.
   */
  get totalTokens(): number {
    return this._totalCompletionTokens + this._totalPromptTokens;
  }

  /**
   * Initializes the token usage handler with optional LLM models.
   * @param {ModelOptions[]} [llmModels] - Optional array of LLM model options.
   */
  constructor(llmModels?: ModelOptions[]) {
    this.bindCallbacksIntoLLM(llmModels);
  }

  /**
   * Binds callback functions to the provided LLM models for tracking token usage.
   * @param {ModelOptions[]} [llmModels] - Optional array of LLM model options.
   */
  public bindCallbacksIntoLLM(llmModels?: ModelOptions[]) {
    llmModels?.forEach((llmModel) => {
      llmModel.callbacks = [
        {
          handleLLMError: () => logger.error('TokenUsageTracker - Error occurred in LLM model'),
          handleLLMStart: (_, prompts) => {
            if (llmModel instanceof ChatAnthropic) {
              this.countTokensFromInput(prompts[0], 'anthropic');
            }

            if (llmModel instanceof ChatMistralAI) {
              this.countTokensFromInput(prompts[0], 'mistral');
            }
          },
          handleLLMEnd: (output) => {
            if (llmModel instanceof ChatOpenAI) {
              this.countTokensOpenAI(output);
            }

            if (llmModel instanceof ChatMistralAI) {
              this.countTokensFromOutput(output, 'mistral');
            }

            if (llmModel instanceof ChatAnthropic) {
              this.countTokensFromOutput(output, 'anthropic');
            }
          },
        },
      ];
    });
  }

  /**
   * Counts and accumulates the number of tokens from a given input string based on the LLM type.
   * @param {string} input - The input string to count tokens from.
   * @param {'mistral' | 'anthropic'} type - The type of LLM to determine the token counting method.
   * @private
   */
  private countTokensFromInput(input: string, type: 'mistral' | 'anthropic') {
    if (type === 'mistral') {
      const tokensCount = getTokensCountMistral(input);

      this._totalPromptTokens += tokensCount;
    } else {
      const tokensCount = getTokensCountAnthropic(input);

      this._totalPromptTokens += tokensCount;
    }
  }

  /**
   * Counts and accumulates the number of tokens from the LLM output based on the LLM type.
   * @param {LLMResult} output - The LLM output to count tokens from.
   * @param {'mistral' | 'anthropic'} type - The type of LLM to determine the token counting method.
   * @private
   */
  private countTokensFromOutput(output: LLMResult, type: 'mistral' | 'anthropic') {
    const llmOutputMessage = output.generations[0][0].text;

    if (type === 'mistral') {
      const tokensCount = getTokensCountMistral(llmOutputMessage);

      this._totalCompletionTokens += tokensCount;
    } else {
      const tokensCount = getTokensCountAnthropic(llmOutputMessage);

      this._totalCompletionTokens += tokensCount;
    }
  }

  /**
   * Counts and accumulates the number of tokens from the OpenAI LLM output.
   * @param {LLMResult} output - The LLM output to count tokens from.
   * @private
   */
  private countTokensOpenAI(output: LLMResult) {
    const estimatedTokenUsage = output.llmOutput?.estimatedTokenUsage;
    const tokenUsage = output.llmOutput?.tokenUsage;

    const { completionTokens, promptTokens } = tokenUsage || estimatedTokenUsage || {};

    if (completionTokens) {
      this._totalCompletionTokens += completionTokens;
    }

    if (promptTokens) {
      this._totalPromptTokens += promptTokens;
    }
  }

  public getCurrentTokenUsage() {
    return {
      totalPromptTokens: this.totalPromptTokens,
      totalCompletionTokens: this.totalCompletionTokens,
      totalTokens: this.totalTokens,
    };
  }
}
