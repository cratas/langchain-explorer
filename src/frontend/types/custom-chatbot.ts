import {
  ConversationModelOptions,
  EmbeddingModelOptions,
  SourceOptions,
} from '@/shared/types/common';

export type CustomChatbotPageSettingsType = {
  conversationModel: ConversationModelOptions;
  conversationTemperature: number;
  embeddingModel: EmbeddingModelOptions;
  chunkSize: number;
  chunkOverlap: number;
  systemMessage: string;
  retrievalSize: number;
  sourceType: SourceOptions;
  sourceFilePdf?: File;
  sourceFileTxt?: File;
  sourceUrl?: string;
};
