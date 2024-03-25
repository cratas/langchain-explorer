import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationModelOptions } from '@/shared/types/common';
import { Message } from 'ai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatChatHistory } from '../utils/format-chat-history';
import { getProviderByModelName } from '../utils/get-provider-by-model';
import { ChatLLMFactory } from '../helpers/chat-llm-factory';

interface ChatServiceOptions {
  modelName: ConversationModelOptions;
  modelTemperature?: number;
  promptTemplate: string;
}

export class ChatService {
  private model: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  private promptTemplate: string;

  constructor({ modelName, modelTemperature = 0.2, promptTemplate }: ChatServiceOptions) {
    this.model = ChatLLMFactory.createObject(
      getProviderByModelName(modelName),
      modelName,
      modelTemperature,
      true
    );

    this.promptTemplate = promptTemplate;
  }

  public getLLMResponseStream = async (messages: Message[]) => {
    try {
      const currentMessageContent = messages[messages.length - 1].content;
      const formattedChatHistory = formatChatHistory(messages.slice(0, -1));

      const prompt = PromptTemplate.fromTemplate(this.promptTemplate);

      const outputParser = new HttpResponseOutputParser();

      const chain = RunnableSequence.from([prompt, this.model, outputParser]);

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
}
