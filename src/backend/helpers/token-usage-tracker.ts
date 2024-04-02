import { LLMResult } from '@langchain/core/outputs';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { getTokensCountMistral } from '@/shared/utils/get-tokens-count-mistral';
import { getTokensCountAnthropic } from '@/shared/utils/get-tokens-count-anthropic';
import { getTokensCountOpenAI } from '@/shared/utils/get-tokens-count-openai';
import { BaseMessageChunk } from '@langchain/core/messages';
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
            if (llmModel instanceof ChatOpenAI) {
              this.countTokensFromInput(prompts[0], 'openai');
            }

            if (llmModel instanceof ChatMistralAI) {
              this.countTokensFromInput(prompts[0], 'mistral');
            }

            if (llmModel instanceof ChatAnthropic) {
              this.countTokensFromInput(prompts[0], 'anthropic');
            }
          },
          handleLLMEnd: (output) => {
            if (llmModel instanceof ChatOpenAI) {
              this.countTokensFromOutput(output, 'openai');
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
   * @param {'mistral' | 'anthropic' | 'opnenai'} type - The type of LLM to determine the token counting method.
   * @private
   */
  private countTokensFromInput(input: string, type: 'mistral' | 'anthropic' | 'openai') {
    switch (type) {
      case 'mistral':
        this._totalPromptTokens += getTokensCountMistral(input);
        break;
      case 'anthropic':
        this._totalPromptTokens += getTokensCountAnthropic(input);
        break;
      case 'openai':
        this._totalPromptTokens += getTokensCountOpenAI(input);
        break;
      default:
        throw new Error('Invalid LLM type');
    }
  }

  /**
   * Counts and accumulates the number of tokens from the LLM output based on the LLM type.
   * @param {LLMResult} output - The LLM output to count tokens from.
   * @param {'mistral' | 'anthropic' | 'openai'} type - The type of LLM to determine the token counting method.
   * @private
   */
  private countTokensFromOutput(output: LLMResult, type: 'mistral' | 'anthropic' | 'openai') {
    const llmOutputMessage = output.generations[0][0].text;

    switch (type) {
      case 'mistral':
        this._totalCompletionTokens += getTokensCountMistral(llmOutputMessage);
        break;
      case 'anthropic':
        this._totalCompletionTokens += getTokensCountAnthropic(llmOutputMessage);
        break;
      case 'openai':
        this._totalCompletionTokens += getTokensCountOpenAI(llmOutputMessage);
        break;
      default:
        throw new Error('Invalid LLM type');
    }
  }

  /**
   * Gets the current token usage statistics.
   * @returns {TokenUsage} The current token usage statistics.
   */
  public getCurrentTokenUsage() {
    return {
      totalPromptTokens: this.totalPromptTokens,
      totalCompletionTokens: this.totalCompletionTokens,
      totalTokens: this.totalTokens,
    };
  }

  public countTokensFromFunctionCallingResponse(response: BaseMessageChunk) {
    const { promptTokens, completionTokens } = response.response_metadata?.tokenUsage ?? {
      promptTokens: 0,
      completionTokens: 0,
    };

    if (promptTokens === 0 && completionTokens === 0) {
      throw new Error('Token usage not found in response metadata');
    }

    this._totalPromptTokens += promptTokens;
    this._totalCompletionTokens += completionTokens;

    logger.info('TokenUsageTracker - Counted tokens from function calling response');
  }
}
