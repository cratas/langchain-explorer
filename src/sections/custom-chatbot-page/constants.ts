import * as Yup from 'yup';
import { DEFAULT_FILE_NAME } from '@/constants/custom-chatbot';
import {
  ConversationModelOptions,
  CustomChatbotPageSettingsType,
  EmbeddingModelOptions,
  OptionType,
  SourceOptions,
} from './types';

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

export const CONVERSATION_MODEL_OPTIONS: OptionType<ConversationModelOptions>[] = [
  {
    label: 'gpt-3.5-turbo-0125 (OpenAI)',
    value: 'gpt-3.5-turbo-0125',
  },
  {
    label: 'gpt-3.5-turbo (OpenAI)',
    value: 'gpt-3.5-turbo',
  },
  {
    label: 'mistral-large-2402 (Mistral AI)',
    value: 'mistral-large-2402',
  },
  {
    label: 'mistral-medium-2312 (Mistral AI)',
    value: 'mistral-medium-2312',
  },
  {
    label: 'mistral-small-2402 (Mistral AI)',
    value: 'mistral-small-2402',
  },
  {
    label: 'claude-3-opus-20240229 (Anthropic)',
    value: 'claude-3-opus-20240229',
  },
  {
    label: 'claude-3-sonnet-20240229 (Anthropic)',
    value: 'claude-3-sonnet-20240229',
  },
  {
    label: 'claude-3-haiku-20240307 (Anthropic)',
    value: 'claude-3-haiku-20240307',
  },
];

export const EMBEDDING_MODEL_OPTIONS: OptionType<EmbeddingModelOptions>[] = [
  {
    label: 'mistral-embed (Mistral AI)',
    value: 'mistral-embed',
  },
  {
    label: 'text-embedding-ada-002 (OpenAI)',
    value: 'text-embedding-ada-002',
  },
  {
    label: 'text-embedding-3-small (OpenAI)',
    value: 'text-embedding-3-small',
  },
  {
    label: 'text-embedding-3-large (OpenAI)',
    value: 'text-embedding-3-large',
  },
];

export const CustomChatbotSettingsSchema = Yup.object().shape({
  conversationModel: Yup.mixed<ConversationModelOptions>()
    .oneOf(CONVERSATION_MODEL_OPTIONS.map((o) => o.value))
    .required('Conversation model is required'),
  conversationTemperature: Yup.number().required('Temperature is required'),
  embeddingModel: Yup.mixed<EmbeddingModelOptions>()
    .oneOf(EMBEDDING_MODEL_OPTIONS.map((o) => o.value))
    .required('Embedding model is required'),
  chunkSize: Yup.number()
    .required('Chunk size is required')
    .min(1, 'Chunk size must be greater than 0')
    .typeError('Chunk size must be a number'),
  chunkOverlap: Yup.number()
    .required('Chunk overlap is required')
    .required('Chunk size is required')
    .min(1, 'Chunk size must be greater than 0')
    .typeError('Chunk size must be a number'),
  retrievalSize: Yup.number()
    .required('Retrieval size is required')
    .required('Chunk overlap is required')
    .required('Chunk size is required')
    .min(1, 'Chunk size must be greater than 0')
    .typeError('Chunk size must be a number'),
  systemMessage: Yup.string().required('System message is required'),
  sourceType: Yup.mixed<SourceOptions>()
    .oneOf(SOURCE_OPTIONS.map((o) => o.value))
    .required('Source type is required'),
  sourceFilePdf: Yup.mixed<File>().when('sourceType', {
    is: 'pdf',
    then: (schema) => schema.required('PDF file is required'),
  }),
  sourceFileTxt: Yup.mixed<File>().when('sourceType', {
    is: 'text',
    then: (schema) =>
      schema
        .required('Text file is required')
        .test('fileSize', 'Text file is required', (value) => value && (value as File)?.size > 0),
  }),
  sourceUrl: Yup.string().when('sourceType', {
    is: (value: string) => value === 'cheerio-web-scraping' || value === 'github-repository',
    then: (schema) => schema.required('URL is required'),
  }),
});

export const defaultValues: CustomChatbotPageSettingsType = {
  conversationModel: 'gpt-3.5-turbo',
  conversationTemperature: 50,
  embeddingModel: 'text-embedding-3-small' as EmbeddingModelOptions,
  chunkSize: 1024,
  chunkOverlap: 200,
  retrievalSize: 3,
  sourceType: 'pdf' as SourceOptions,
  systemMessage: 'Example system message.',
  sourceFilePdf: {
    name: DEFAULT_FILE_NAME,
    size: 1200000,
    type: 'application/pdf',
    lastModified: Date.now(),
  } as File,
  sourceFileTxt: {} as File,
  sourceUrl: '',
};

export const SETTINGS_FORM_LABELS: { [K in keyof CustomChatbotPageSettingsType]?: string } = {
  conversationModel: 'Conversation LLM',
  conversationTemperature: 'Temperature',
  embeddingModel: 'Embedding LLM',
  chunkSize: 'Chunk size',
  chunkOverlap: 'Chunk overlap',
  retrievalSize: 'Retrieval size',
  sourceType: 'Source type',
  sourceFilePdf: 'PDF file',
  sourceFileTxt: 'Text file',
  sourceUrl: 'URL',
  systemMessage: 'System message',
};
