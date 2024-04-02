import {
  ConversationModelOptions,
  EmbeddingLLMProvider,
  EmbeddingModelOptions,
} from '@/shared/types/common';
import { ChatMistralAI, MistralAIEmbeddings } from '@langchain/mistralai';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { QA_TEMPLATE } from '@/constants/custom-chatbot';
import { LangChainStream, Message } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_API_KEY, PINECONE_INDEX } from '@/config-global';
import { PineconeStore } from '@langchain/pinecone';
import { ChatLLMFactory } from '../helpers/chat-llm-factory';
import { getProviderByModelName } from '../utils/get-provider-by-model';
import { STANDALONE_QUESTION_TEMPLATE } from '../constants/prompt-templates';
import { formatChatHistory } from '../utils/format-chat-history';
import { EmbeddingLLMFactory } from '../helpers/embedding-llm-factory';
import { logger } from '../../../logger';
import { TokenUsageTrackerRegistry } from '../helpers/token-usage-tracker-registry';
import { ModelOptions } from '../types/token-usage';

interface CustomChatbotServiceOptions {
  conversationModelName: ConversationModelOptions;
  conversationModelTemperature: number;
  embeddingModel: EmbeddingModelOptions;
  pineconeNamespaceName: string;
  retrievalSize: number;
  tokensUsageTrackerKey?: string;
}

/**
 * Service class for handling custom chatbot interactions.
 * This class encapsulates the logic for managing chatbot conversations,
 * combining language model responses with vector store retrieval capabilities
 * for enhanced conversational experiences.
 */
export class CustomChatbotService {
  /**
   * The streaming language model instance used for real-time chat responses.
   * @private
   */
  private readonly _streamingModel: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  /**
   * The non-streaming language model instance used for processing stand-alone questions.
   * @private
   */
  private readonly _nonStreamingModel: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  /**
   * The embedding model instance used for vector store retrievals.
   * @private
   */
  private readonly _embeddingModel: OpenAIEmbeddings | MistralAIEmbeddings;

  /**
   * The namespace name used in the Pinecone vector store.
   * @private
   */
  private readonly _pineconeNamespaceName: string;

  /**
   * The number of retrieved items in vector store retrieval operations.
   * @private
   */
  private readonly _retrievalSize: number;

  /**
   * Constructs a CustomChatbotService object.
   * Initializes language model instances for streaming and non-streaming scenarios,
   * an embedding model for vector store retrievals, and sets retrieval parameters.
   * Also initializes token usage tracking for the configured language models.
   *
   * @param {CustomChatbotServiceOptions} options - Configuration options for the chatbot service.
   */
  constructor({
    conversationModelName,
    conversationModelTemperature,
    embeddingModel,
    pineconeNamespaceName,
    retrievalSize = 3,
    tokensUsageTrackerKey,
  }: CustomChatbotServiceOptions) {
    this._streamingModel = ChatLLMFactory.createObject(
      getProviderByModelName(conversationModelName),
      conversationModelName,
      conversationModelTemperature,
      true
    );

    this._nonStreamingModel = ChatLLMFactory.createObject(
      getProviderByModelName(conversationModelName),
      conversationModelName,
      conversationModelTemperature,
      false
    );

    this._embeddingModel = EmbeddingLLMFactory.createObject(
      getProviderByModelName(embeddingModel) as EmbeddingLLMProvider,
      embeddingModel
    );

    const supportedLLMModels: ModelOptions[] = [];

    if (tokensUsageTrackerKey) {
      supportedLLMModels.push(this._streamingModel);

      supportedLLMModels.push(this._nonStreamingModel);

      TokenUsageTrackerRegistry.trackTockenUsage(tokensUsageTrackerKey, supportedLLMModels);

      logger.info(`CustomChatbotService - Tracking token usage for key: ${tokensUsageTrackerKey}`);
    }

    this._pineconeNamespaceName = pineconeNamespaceName;

    this._retrievalSize = retrievalSize;
  }

  /**
   * Retrieves a vector store instance for information retrieval.
   * Sets up a Pinecone vector store retriever with the configured embedding model and namespace.
   *
   * @returns {Promise<Retriever>} A promise resolving to a retriever instance.
   * @throws {Error} Throws an error if the retriever setup fails.
   * @private
   */
  private getVectorStoreRetrieval = async () => {
    try {
      const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

      const pcIndex = pc.Index(PINECONE_INDEX);

      const pcStore = await PineconeStore.fromExistingIndex(this._embeddingModel, {
        pineconeIndex: pcIndex,
        namespace: this._pineconeNamespaceName,
      });

      logger.info(
        `CustomChatbotService - Retrieved Pinecone store for namespace: ${this._pineconeNamespaceName}`
      );

      return pcStore.asRetriever({ k: this._retrievalSize });
    } catch (error) {
      logger.error(`CustomChatbotService - Error in getVectorStoreRetrieval: ${error}`);

      throw new Error(`Error in getVectorStoreRetrieval: ${error}`);
    }
  };

  /**
   * Generates a streaming response for a given set of chat messages.
   * Processes the input messages through a ConversationalRetrievalQAChain
   * to combine language model responses with vector store retrievals.
   *
   * @param {Message[]} messages - An array of messages in the chat conversation.
   * @returns {Promise<Stream>} A promise resolving to a stream of chatbot responses.
   * @throws {Error} Throws an error if the streaming response generation fails.
   */
  public getLLMResponseStream = async (messages: Message[]) => {
    try {
      const question = messages[messages.length - 1].content;

      const vectorStoreRetrieval = await this.getVectorStoreRetrieval();

      const chain = ConversationalRetrievalQAChain.fromLLM(
        this._streamingModel,
        vectorStoreRetrieval,
        {
          qaTemplate: QA_TEMPLATE,
          questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
          questionGeneratorChainOptions: {
            llm: this._nonStreamingModel,
          },
        }
      );

      let sanitizedQuestion = question;

      if (this._streamingModel instanceof ChatOpenAI) {
        sanitizedQuestion = question.trim().replaceAll('\n', ' '); // OpenAI recommendation
      }

      const { stream, handlers } = LangChainStream();

      chain.invoke(
        {
          question: sanitizedQuestion,
          chat_history: formatChatHistory(messages),
        },
        { callbacks: [handlers] }
      );

      logger.info(`CustomChatbotService - Generated streaming response for question: ${question}`);

      return stream;
    } catch (error) {
      logger.error(`CustomChatbotService - Error in getLLMResponseStream: ${error}`);

      throw new Error(`Error in getLLMResponseStream: ${error}`);
    }
  };
}
