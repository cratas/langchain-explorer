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

export class ChatService {
  private _model: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  private readonly _promptTemplate: string;

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

  private getLLMChatChain = (streaming: boolean) => {
    const prompt = PromptTemplate.fromTemplate(this._promptTemplate);

    console.log('prompt', prompt);

    const outputParser = new HttpResponseOutputParser();

    return streaming
      ? RunnableSequence.from([prompt, this._model, outputParser])
      : RunnableSequence.from([prompt, this._model]);
  };

  public getLLMResponse = async (messages: Message[]) => {
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
      // TODO: handle by error type
      throw new Error(`Error in getLLMResponseStream ${error}`);
    }
  };

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
      // TODO: handle by error type
      throw new Error(`Error in getLLMResponseStream ${error}`);
    }
  };

  public getLLMResponseStreamWithoutChatHistory = async (input: string) => {
    const chain = this.getLLMChatChain(true);

    const stream = await chain.stream({ input });

    return stream;
  };
}
