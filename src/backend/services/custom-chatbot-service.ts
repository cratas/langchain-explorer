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

interface CustomChatbotServiceOptions {
  conversationModelName: ConversationModelOptions;
  conversationModelTemperature: number;
  embeddingModel: EmbeddingModelOptions;
  pineconeNamespaceName: string;
  retrievalSize: number;
}

export class CustomChatbotService {
  private streamingModel: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  private nonStreamingModel: ChatMistralAI | ChatOpenAI | ChatAnthropic;

  private embeddingModel: OpenAIEmbeddings | MistralAIEmbeddings;

  private pineconeNamespaceName: string;

  private retrievalSize: number;

  constructor({
    conversationModelName,
    conversationModelTemperature,
    embeddingModel,
    pineconeNamespaceName,
    retrievalSize = 3,
  }: CustomChatbotServiceOptions) {
    this.streamingModel = ChatLLMFactory.createObject(
      getProviderByModelName(conversationModelName),
      conversationModelName,
      conversationModelTemperature,
      true
    );

    this.nonStreamingModel = ChatLLMFactory.createObject(
      getProviderByModelName(conversationModelName),
      conversationModelName,
      conversationModelTemperature,
      false
    );

    this.embeddingModel = EmbeddingLLMFactory.createObject(
      getProviderByModelName(embeddingModel) as EmbeddingLLMProvider,
      embeddingModel
    );

    this.pineconeNamespaceName = pineconeNamespaceName;

    this.retrievalSize = retrievalSize;
  }

  private getVectorStoreRetrieval = async () => {
    try {
      const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

      const pcIndex = pc.Index(PINECONE_INDEX);

      const pcStore = await PineconeStore.fromExistingIndex(this.embeddingModel, {
        pineconeIndex: pcIndex,
        namespace: this.pineconeNamespaceName,
      });

      return pcStore.asRetriever({ k: this.retrievalSize });
    } catch (error) {
      throw new Error(`Error in getVectorStoreRetrieval: ${error}`);
    }
  };

  public getLLMResponseStream = async (messages: Message[]) => {
    try {
      const question = messages[messages.length - 1].content;

      const vectorStoreRetrieval = await this.getVectorStoreRetrieval();

      const chain = ConversationalRetrievalQAChain.fromLLM(
        this.streamingModel,
        vectorStoreRetrieval,
        {
          qaTemplate: QA_TEMPLATE,
          questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
          questionGeneratorChainOptions: {
            llm: this.nonStreamingModel,
          },
        }
      );

      let sanitizedQuestion = question;

      if (this.streamingModel instanceof ChatOpenAI) {
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

      return stream;
    } catch (error) {
      // TODO: Handle by exception type
      throw new Error(`Error in getLLMResponseStream: ${error}`);
    }
  };
}
