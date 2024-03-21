export type OptionType<T extends string> = { label: string; value: T };

export type SourceOptions = 'pdf' | 'text' | 'github-repository' | 'cheerio-web-scraping';

export const SOURCE_OPTIONS: OptionType<SourceOptions>[] = [
  {
    label: 'PDF',
    value: 'pdf',
  },
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'GitHub Repository',
    value: 'github-repository',
  },
  {
    label: 'Cheerio Web Scraping',
    value: 'cheerio-web-scraping',
  },
];

export const CONVERSATION_MODEL_OPTIONS: OptionType<string>[] = [
  {
    label: 'chatgpt-3.5 (OpenAI)',
    value: 'gpt-3.5-turbo',
  },
  {
    label: 'gpt-3.5-turbo (OpenAI)',
    value: 'gpt-3.5-turbo',
  },
  // {
  //   label: 'mistral-large-2402 (Mistral AI)',
  //   value: 'mistral-large-2402',
  // },
  {
    label: 'mistral-medium-2312 (Mistral AI)',
    value: 'mistral-medium-2312',
  },
  {
    label: 'mistral-small-2402 (Mistral AI)',
    value: 'mistral-small-2402',
  },
  // {
  //   label: 'claude-3-opus-20240229 (Anthropic)',
  //   value: 'claude-3-opus-20240229',
  // },
  {
    label: 'claude-3-sonnet-20240229 (Anthropic)',
    value: 'claude-3-sonnet-20240229',
  },
  {
    label: 'claude-3-haiku-20240307 (Anthropic)',
    value: 'claude-3-haiku-20240307',
  },
];

export const EMBEDDING_MODEL_OPTIONS: OptionType<string>[] = [
  {
    label: 'text-embedding-3-small (OpenAI)',
    value: 'text-embedding-3-small',
  },
  {
    label: 'text-embedding-3-large (OpenAI)',
    value: 'text-embedding-3-large',
  },
  {
    label: 'text-embedding-ada-002 (OpenAI)',
    value: 'text-embedding-ada-002',
  },
];
