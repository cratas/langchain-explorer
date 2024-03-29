import { LLMResult } from '@langchain/core/outputs';
import { ChatOpenAI } from '@langchain/openai';

export class TokenUsageHandler {
  private _totalPromptTokens = 0;

  private _totalCompletionTokens = 0;

  private _totalTokens = 0;

  get totalPromptTokens() {
    return this._totalPromptTokens;
  }

  get totalCompletionTokens() {
    return this._totalCompletionTokens;
  }

  get totalTokens() {
    return this._totalTokens;
  }

  constructor(llmModels?: ChatOpenAI[]) {
    this.bindCallbackSIntoLLM(llmModels);
  }

  public bindCallbackSIntoLLM(llmModels?: ChatOpenAI[]) {
    llmModels?.forEach((llmModel) => {
      llmModel.callbacks = [
        {
          handleLLMEnd: (output) => {
            this.countTokens(output);
          },
        },
      ];
    });
  }

  private countTokens(output: LLMResult) {
    const { totalTokens, completionTokens, promptTokens } =
      output.llmOutput?.estimatedTokenUsage ?? {};

    if (totalTokens) {
      this._totalTokens += totalTokens;
    }

    if (completionTokens) {
      this._totalCompletionTokens += completionTokens;
    }

    if (promptTokens) {
      this._totalPromptTokens += promptTokens;
    }
  }
}
