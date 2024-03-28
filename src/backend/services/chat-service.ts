import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai';
import { ConversationModelOptions } from '@/shared/types/common';
import { Message } from 'ai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { BaseMessageChunk } from '@langchain/core/messages';
import { formatChatHistory } from '../utils/format-chat-history';
import { getProviderByModelName } from '../utils/get-provider-by-model';
import { ChatLLMFactory } from '../helpers/chat-llm-factory';

interface ChatServiceOptions {
  modelName: ConversationModelOptions;
  modelTemperature?: number;
  promptTemplate: string;
  functionCallsDefinition?: Partial<ChatOpenAICallOptions>;
}

/**
 * Service class for handling chat operations with different language model providers.
 * This class encapsulates the logic for initializing and interacting with chat models
 * from various providers like MistralAI, OpenAI, and Anthropic.
 */
export class ChatService {
  /**
   * The chat model instance from one of the supported providers.
   * @private
   */
  private _model: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  /**
   * The template used for generating prompts.
   * @private
   */
  private readonly _promptTemplate: string;

  /**
   * Constructs a ChatService object.
   * Initializes the chat model based on provided options and configures the prompt template.
   *
   * @param {ChatServiceOptions} options - The configuration options for the chat service.
   */
  constructor({
    modelName,
    modelTemperature = 0.2,
    promptTemplate,
    functionCallsDefinition,
  }: ChatServiceOptions) {
    const baseModel = ChatLLMFactory.createObject(
      getProviderByModelName(modelName),
      modelName,
      modelTemperature,
      true
    );

    if (baseModel instanceof ChatOpenAI && functionCallsDefinition) {
      this._model = baseModel.bind(functionCallsDefinition) as ChatOpenAI;
    } else {
      this._model = baseModel;
    }

    this._promptTemplate = promptTemplate;
  }

  /**
   * Creates a RunnableSequence for processing chat inputs with the configured model.
   * This sequence can be used for streaming or single-response scenarios.
   *
   * @param {boolean} streaming - Indicates if the chain should be set up for streaming.
   * @returns {RunnableSequence} A sequence that can be invoked or streamed.
   * @private
   */
  private getLLMChatChain = (streaming: boolean): RunnableSequence => {
    const prompt = PromptTemplate.fromTemplate(this._promptTemplate);

    const outputParser = new HttpResponseOutputParser();

    return streaming
      ? RunnableSequence.from([prompt, this._model, outputParser])
      : RunnableSequence.from([prompt, this._model]);
  };

  /**
   * Processes a single input message and returns a response.
   * Utilizes a pre-configured chain of operations to generate a response from the model.
   *
   * @param {Message[]} messages - An array of previous messages in the conversation.
   * @returns {Promise<BaseMessageChunk>} A promise resolving to the response from the model.
   * @throws {Error} Throws an error if the operation fails.
   */
  public getLLMResponse = async (messages: Message[]): Promise<BaseMessageChunk> => {
    try {
      const currentMessageContent = messages[messages.length - 1].content;
      const formattedChatHistory = formatChatHistory(messages.slice(0, -1));

      const chain = this.getLLMChatChain(false);

      const response = await chain.invoke({
        chat_history: formattedChatHistory,
        input: currentMessageContent,
      });

      return response as BaseMessageChunk;
    } catch (error) {
      throw new Error(`Error in getLLMResponseStream ${error}`);
    }
  };

  /**
   * Initiates a streaming response sequence for a given set of messages.
   * This is useful for scenarios where responses are expected to be streamed over time.
   *
   * @param {Message[]} messages - An array of previous messages in the conversation.
   * @returns {Promise<Stream>} A promise resolving to a stream of responses.
   * @throws {Error} Throws an error if the streaming operation fails.
   */
  public getLLMResponseStream = async (messages: Message[]) => {
    try {
      const currentMessageContent = messages[messages.length - 1].content;
      const formattedChatHistory = formatChatHistory(messages.slice(0, -1));

      const chain = this.getLLMChatChain(true);

      const stream = await chain.stream({
        chat_history: formattedChatHistory,
        input: currentMessageContent,
      });

      return stream;
    } catch (error) {
      throw new Error(`Error in getLLMResponseStream ${error}`);
    }
  };

  /**
   * Initiates a streaming response sequence without considering any chat history.
   * Directly processes the input string and returns a stream of responses.
   *
   * @param {string} input - The input message to be processed.
   * @returns {Promise<Stream>} A promise resolving to a stream of responses.
   * @throws {Error} Throws an error if the streaming operation fails.
   */
  public getLLMResponseStreamWithoutChatHistory = async (input: string) => {
    const chain = this.getLLMChatChain(true);

    const stream = await chain.stream({ input });

    return stream;
  };
}
