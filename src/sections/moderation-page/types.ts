import * as Yup from 'yup';
import { SYSTEM_MESSAGE_NO_COMPETITION } from '@/constants/moderation';
import { CONVERSATION_MODEL_OPTIONS, ConversationModelOptions } from '../custom-chatbot-page/types';

export type OptionType<T extends string> = { label: string; value: T };

export type ModerationPageSettingsType = {
  conversationModel: ConversationModelOptions;
  conversationTemperature: number;
  minScore: number;
  systemMessage: string;
  categories: {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    'self-harm': boolean;
    'sexual/minors': boolean;
    'hate/threatening': boolean;
    'violence/graphic': boolean;
    'self-harm/intent': boolean;
    'self-harm/instructions': boolean;
    'harassment/threatening': boolean;
    violence: boolean;
  };
};

export type ModerationModelOptions =
  | 'text-moderation-latest'
  | 'test-moderation-stable'
  | 'text-moderation-007';

export const ModerationSettingsSchema = Yup.object().shape({
  conversationModel: Yup.mixed<ConversationModelOptions>()
    .oneOf(CONVERSATION_MODEL_OPTIONS.map((o) => o.value))
    .required('Conversation model is required'),
  conversationTemperature: Yup.number().required('Temperature is required'),
  minScore: Yup.number().required('Min score is required'),
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

export const MODERATION_MODEL_OPTIONS: OptionType<ModerationModelOptions>[] = [
  {
    label: 'text-moderation-latest (OpenAI)',
    value: 'text-moderation-latest',
  },
  {
    label: 'test-moderation-stable (OpenAI)',
    value: 'test-moderation-stable',
  },
  {
    label: 'text-moderation-007 (OpenAI)',
    value: 'text-moderation-007',
  },
];

export const SETTINGS_FORM_LABELS: { [K in keyof ModerationPageSettingsType]?: string } = {
  conversationModel: 'Conversation LLM',
  conversationTemperature: 'Temperature',
  minScore: 'Min. score',
  systemMessage: 'System Message',
  categories: 'Classification categories',
};
