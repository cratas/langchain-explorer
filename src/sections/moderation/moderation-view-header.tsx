import { BaseUseCaseViewHeader } from '@/components/common/base-use-case-view-header';

export const ModerationViewHeader = () => (
  <BaseUseCaseViewHeader
    title="What is Moderation Layer?"
    description="
      In the context of Large Language Models (LLMs), a moderation layer refers to a system or set 
      of processes designed to review, filter, or modify the output of the model to ensure it adheres
      to certain standards, guidelines, or ethical considerations. This is particularly important 
      because LLMs, while powerful, can sometimes generate inappropriate, biased, or harmful content."
    buttonText="Create custom Moderation Layer"
    chipItems={[
      'Inappropriate context filter',
      'Pre-set moderation',
      'Competition filter',
      'Youth audience suitability',
      'Financial advice filter',
    ]}
    settingsItems={[
      {
        label: 'Conversation model',
        value: 'gpt-3.5-turbo',
        tooltipContent: 'LLM Model used for conversation.',
      },
      {
        label: 'Moderation model',
        value: 'text-moderation-007',
        tooltipContent: 'LLM Model used for moderation.',
      },
      {
        label: 'LLM Temperature',
        value: '0.2',
        tooltipContent: 'Temperature of conversation LLM.',
      },
      {
        label: 'Min score',
        value: '0.1',
        tooltipContent:
          'The minimum score of classification value for inclusion in the relevant category.',
      },

      {
        label: 'Category',
        value: 'self-harm',
        tooltipContent:
          'Content that promotes, encourages, or depicts acts of self-harm, such as suicide, cutting, and eating disorders.',
      },
      {
        label: 'Category',
        value: 'sexual',
        tooltipContent:
          'Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness).',
      },
      {
        label: 'Category',
        value: 'harrasment',
        tooltipContent:
          'Content that expresses, incites, or promotes harassing language towards any target.',
      },
      {
        label: 'Category',
        value: 'violence',
        tooltipContent: 'Content that depicts death, violence, or physical injury.',
      },
      {
        label: 'Category',
        value: 'hate',
        tooltipContent:
          'Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste. Hateful content aimed at non-protected groups (e.g., chess players) is harassment.',
      },
    ]}
  />
);
