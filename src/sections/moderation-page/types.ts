import * as Yup from 'yup';
import { CONVERSATION_MODEL_OPTIONS, ConversationModelOptions } from '../custom-chatbot-page/types';

export type OptionType<T extends string> = { label: string; value: T };

export type ModerationPageSettingsType = {
  conversationModel: ConversationModelOptions;
  conversationTemperature: number;
  minScore: number;
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
});

export const defaultValues: ModerationPageSettingsType = {
  conversationModel: 'gpt-3.5-turbo',
  conversationTemperature: 50,
  minScore: 20,
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
};
