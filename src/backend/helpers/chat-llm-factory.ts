import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ANTHROPIC_API_KEY, MISTRAL_API_KEY, OPENAI_API_KEY } from '@/config-global';
import { ChatLLMProvider } from '@/shared/types/common';

/**
 * Factory class responsible for creating instances of chat language models.
 * It abstracts the instantiation logic of various language models provided by different providers.
 */
export class ChatLLMFactory {
  /**
   * Creates an instance of a chat language model based on the specified provider, model, and temperature settings.
   *
   * Depending on the provider ('mistral', 'openai', or 'anthropic'), it initializes and returns an instance of
   * the corresponding chat language model (`ChatMistralAI`, `ChatOpenAI`, or `ChatAnthropic`).
   * This method also allows specifying whether the model should be used in streaming mode and sets the temperature
   * parameter, which controls the randomness of the model's responses.
   *
   * @param {ChatLLMProvider} provider - The provider of the language model, determining the specific service to be used.
   * @param {string} model - The name of the model to use from the selected provider.
   * @param {number} temperature - Controls the randomness of the model's output. Higher values result in more random responses.
   * @param {boolean} [streaming=false] - Indicates whether the model should be used in streaming mode.
   * @returns {ChatMistralAI | ChatOpenAI | ChatAnthropic} An instance of the chat language model corresponding to the provided provider, configured with the given model name and temperature.
   * @throws {Error} If an invalid provider is specified, an error is thrown.
   */
  static createObject(
    provider: ChatLLMProvider,
    model: string,
    temperature: number,
    streaming: boolean = false
  ): ChatMistralAI | ChatOpenAI | ChatAnthropic {
    switch (provider) {
      case 'mistral':
        return new ChatMistralAI({
          modelName: model,
          apiKey: MISTRAL_API_KEY,
          temperature,
          streaming,
        });
      case 'openai':
        return new ChatOpenAI({
          modelName: model,
          openAIApiKey: OPENAI_API_KEY,
          streaming,
          temperature,
        });
      case 'anthropic':
        return new ChatAnthropic({
          modelName: model,
          anthropicApiKey: ANTHROPIC_API_KEY,
          streaming,
          temperature,
        });
      default:
        throw new Error('Invalid provider');
    }
  }
}
