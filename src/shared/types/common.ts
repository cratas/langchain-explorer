export type OptionType<T extends string> = { label: string; value: T };

export type SourceOptions = 'pdf' | 'text' | 'github-repository' | 'cheerio-web-scraping';

export type ConversationModelOptions =
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0125'
  | 'mistral-large-2402'
  | 'mistral-medium-2312'
  | 'mistral-small-2402'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307';

export type FlaggingOptions = 'openai' | 'classification';

export type EmbeddingModelOptions =
  | 'mistral-embed'
  | 'text-embedding-ada-002'
  | 'text-embedding-3-small'
  | 'text-embedding-3-large';

export type ChatLLMProvider = 'openai' | 'anthropic' | 'mistral';

export type EmbeddingLLMProvider = 'openai' | 'mistral';

export type UseCaseKey =
  | 'custom-chatbot-sample'
  | 'custom-chatbot-main'
  | 'customer-support'
  | 'moderation-sample'
  | 'moderation-main';
