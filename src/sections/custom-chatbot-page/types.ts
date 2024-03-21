export type OptionType<T extends string> = { label: string; value: T };

export type SourceOptions = 'pdf' | 'text' | 'github-repository' | 'cheerio-web-scraping';

export type ConversationModelOptions =
  | 'gpt-3.5-turbo'
  | 'mistral-large-2402'
  | 'mistral-medium-2312'
  | 'mistral-small-2402'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307';

export type EmbeddingModelOptions = 'text-embedding-3-small' | 'text-embedding-3-large';

export type CustomChatbotPageSettingsType = {
  conversationModel: ConversationModelOptions;
  conversationTemperature: number;
  embeddingModel: EmbeddingModelOptions;
  embeddingTemperature: number;
  chunkSize: number;
  chunkOverlap: number;
  systemMessage: string;
  retrievalSize: number;
  sourceType: SourceOptions;
  sourceFilePdf?: File;
  sourceFileTxt?: File;
  sourceUrl?: string;
};
