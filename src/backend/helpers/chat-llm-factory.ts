import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ANTHROPIC_API_KEY, MISTRAL_API_KEY, OPENAI_API_KEY } from '@/config-global';

/**
 * Creates an instance of a chat language model based on the provided provider, model, and temperature settings.
 *
 * @param { 'mistral' | 'openai' | 'anthropic' } provider - The provider of the language model. It specifies which service (Mistral AI, OpenAI, or Anthropic) will be used.
 * @param { string } model - The name of the model to be used from the selected provider.
 * @param { number } temperature - A parameter that controls the randomness of the output. Higher values result in more random responses.
 * @param { boolean } streaming - A boolean value that specifies whether the model should be used in streaming mode. If set to `true`, the model will be used in streaming mode; otherwise, it will be used in non-streaming mode.
 * @returns { ChatMistralAI | ChatOpenAI | ChatAnthropic } Returns an instance of `ChatMistralAI` or `ChatOpenAI` or `ChatAnthropic` depending on the provider chosen. This instance is configured with the specified model and temperature.
 * @throws { Error } Throws an error if an invalid provider is specified.
 *
 * This method is a part of the `ChatLLMFactory` class, which is responsible for creating instances of chat language models. The method takes in three parameters: the provider (which can be 'mistral', 'openai', or 'anthropic'),
 *  the model name, and the temperature setting. Depending on the provider, it creates a new instance of either `ChatMistralAI` or `ChatOpenAI` with the provided configuration and returns it. It also features error handling for cases where an invalid provider is passed.
 */
export class ChatLLMFactory {
  static createObject(
    provider: 'mistral' | 'openai' | 'anthropic',
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
