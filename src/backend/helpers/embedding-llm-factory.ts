import { MistralAIEmbeddings } from '@langchain/mistralai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MISTRAL_API_KEY, OPENAI_API_KEY } from '@/config-global';
import { EmbeddingLLMProvider } from '@/shared/types/common';

/**
 * Factory class for creating embedding instances from different language learning model providers.
 * This class encapsulates the logic required to instantiate embedding models from specified providers,
 * making it easy to integrate and switch between different LLM (Language Learning Model) providers.
 */
export class EmbeddingLLMFactory {
  /**
   * Creates an embedding instance based on the specified LLM provider and model.
   *
   * Depending on the provider (currently 'openai' or 'mistral'), this method initializes and returns an instance
   * of either `OpenAIEmbeddings` or `MistralAIEmbeddings`. Each instance is configured with the specified model
   * name and the relevant API key retrieved from configuration settings.
   *
   * @param {EmbeddingLLMProvider} provider - The provider of the embedding model, determining which embedding class
   *                                          to instantiate (OpenAI or Mistral AI).
   * @param {string} model - The model name to use with the embedding provider. It must correspond to one of the models
   *                         supported by the selected provider.
   * @returns {OpenAIEmbeddings | MistralAIEmbeddings} An instance of the specified provider's embedding model.
   * @throws {Error} If an invalid provider is specified, an error is thrown.
   */
  static createObject(
    provider: EmbeddingLLMProvider,
    model: string
  ): OpenAIEmbeddings | MistralAIEmbeddings {
    switch (provider) {
      case 'openai':
        return new OpenAIEmbeddings({
          modelName: model,
          openAIApiKey: OPENAI_API_KEY,
        });
      case 'mistral':
        return new MistralAIEmbeddings({
          modelName: model,
          apiKey: MISTRAL_API_KEY,
        });

      default:
        throw new Error('Invalid provider');
    }
  }
}
