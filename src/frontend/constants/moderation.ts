import { ConversationModelOptions, FlaggingOptions } from '@/shared/types/common';
import * as Yup from 'yup';
import { ModerationPageSettingsType, ModerationUseCase } from '@/frontend/types/moderation';
import { CONVERSATION_MODEL_OPTIONS, FLAG_OPTIONS } from './custom-chatbot';

export const SYSTEM_MESSAGE_NO_COMPETITION =
  'You are an Apple assistant. You are here to help people choose Apple products. If you see any messages that are related to competiors or are not related to Apple products, you will flag them.';

export const SYSTEM_MESSAGE_YOUTH_AUDIENCE =
  'You are an AI assistent for a youth audience (Childhood 3 - 11 years old). Use simple, clear, and engaging language appropriate for young children. Topics should be relatable and interesting to this age group, focusing on basic educational concepts, storytelling, and playful interaction. Avoid any complex topics, jargon, or sensitive subjects. Encourage curiosity and learning in a fun, safe, and positive manner.';

export const SYSTEM_MESSAGE_NO_FINANCE_ADVICES =
  "You are an AI assistant for a trading platform like XTB. Your role is to assist users with platform-related queries, explain basic trading concepts, and guide them on using the platform's features. Avoid offering specific trading advice, stock picks, or market timing suggestions. Encourage users to consult with financial advisors for personalized investment strategies.";

export const OPTIONS: ModerationUseCase[] = [
  {
    label: 'Youth Audience',
    value: 'youth_audience',
    systemMessage: SYSTEM_MESSAGE_YOUTH_AUDIENCE,
    description:
      'Chat is set up to answer to youth audience with an emphasis on simplicity and educational content. Chat is also set up to filter out anything that is potentially harmful.',
  },
  {
    label: 'Apple products support',
    value: 'apple_products_support',
    systemMessage: SYSTEM_MESSAGE_NO_COMPETITION,
    description:
      'Chat is set up to answer without mentioning competitors. Chat is also set up to filter out anything that is potentially harmful.',
  },
  {
    label: 'Trading platform',
    value: 'trading_platform',
    systemMessage: SYSTEM_MESSAGE_NO_FINANCE_ADVICES,
    description:
      'Chat is also set up to answer without giving financial advice. Chat is also set up to filter out anything that is potentially harmful. ',
  },
];

export const ModerationSettingsSchema = Yup.object().shape({
  conversationModel: Yup.mixed<ConversationModelOptions>()
    .oneOf(CONVERSATION_MODEL_OPTIONS.map((o) => o.value))
    .required('Conversation model is required'),
  conversationTemperature: Yup.number().required('Temperature is required'),
  minScore: Yup.number().required('Min score is required'),
  flagBy: Yup.mixed<FlaggingOptions>()
    .oneOf(FLAG_OPTIONS.map((o) => o.value))
    .required('Flag by is required'),
  systemMessage: Yup.string().required('System message is required'),
  categories: Yup.object().shape({
    sexual: Yup.boolean().required(),
    hate: Yup.boolean().required(),
    harassment: Yup.boolean().required(),
    'self-harm': Yup.boolean().required(),
    'sexual/minors': Yup.boolean().required(),
    'hate/threatening': Yup.boolean().required(),
    'violence/graphic': Yup.boolean().required(),
    'self-harm/intent': Yup.boolean().required(),
    'self-harm/instructions': Yup.boolean().required(),
    'harassment/threatening': Yup.boolean().required(),
    violence: Yup.boolean().required(),
  }),
});

export const defaultValues: ModerationPageSettingsType = {
  conversationModel: 'gpt-3.5-turbo',
  conversationTemperature: 0.2,
  flagBy: 'classification',
  minScore: 0.5,
  systemMessage: SYSTEM_MESSAGE_NO_COMPETITION,
  categories: {
    sexual: true,
    hate: true,
    harassment: true,
    'self-harm': true,
    'sexual/minors': true,
    'hate/threatening': true,
    'violence/graphic': true,
    'self-harm/intent': true,
    'self-harm/instructions': true,
    'harassment/threatening': true,
    violence: true,
  },
};

export const SETTINGS_FORM_LABELS: { [K in keyof ModerationPageSettingsType]?: string } = {
  conversationModel: 'Conversation LLM',
  conversationTemperature: 'Temperature',
  minScore: 'Min. score',
  systemMessage: 'System Message',
  categories: 'Classification categories',
};
