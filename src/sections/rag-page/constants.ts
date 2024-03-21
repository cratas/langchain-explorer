import * as Yup from 'yup';
import { DEFAULT_FILE_NAME } from '@/constants/custom-chatbot';
import { SOURCE_OPTIONS, SourceOptions } from './types';

export const RAGSettingsSchema = Yup.object().shape({
  conversationModel: Yup.string().required('Conversation model is required'),
  conversationTemperature: Yup.number().required('Temperature is required'),
  embeddingModel: Yup.string().required('Embedding model is required'),
  embeddingTemperature: Yup.number().required('Temperature is required'),
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
  sourceFilePdf: Yup.mixed().when('sourceType', {
    is: 'pdf',
    then: (schema) => schema.required('PDF file is required'),
  }),
  sourceFileTxt: Yup.mixed().when('sourceType', {
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

export const defaultValues = {
  conversationModel: 'gpt-3.5-turbo',
  conversationTemperature: 50,
  embeddingModel: 'chatgpt-3.5',
  embeddingTemperature: 50,
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
  },
  sourceFileTxt: {},
  sourceUrl: '',
};
