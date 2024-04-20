import { yupResolver } from '@hookform/resolvers/yup';
import React, { MutableRefObject, useEffect, useImperativeHandle } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import FormProvider from '@/frontend/components/form/form-provider';
import { RHFCheckbox, RHFSelect, RHFSlider, RHFTextarea } from '@/frontend/components/form';
import { UseCaseSettingsCard } from '@/frontend/components/common';
import { ModerationPageSettingsType } from '@/frontend/types/moderation';
import { ModerationSettingsSchema } from '@/frontend/constants/moderation';
import { CONVERSATION_MODEL_OPTIONS, FLAG_OPTIONS } from '@/frontend/constants/custom-chatbot';
import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';

type Props = {
  formRef: MutableRefObject<unknown>;
  defaultSettings: ModerationPageSettingsType;
  changeSettings: (data: ModerationPageSettingsType) => void;
};

export const ModerationPageSettings = ({ formRef, defaultSettings, changeSettings }: Props) => {
  useImperativeHandle(formRef, () => ({
    submit: () => onSubmit(getValues()),
  }));

  const methods = useForm<ModerationPageSettingsType>({
    defaultValues: defaultSettings,
    resolver: yupResolver(ModerationSettingsSchema),
  });

  const { handleSubmit, getValues, trigger } = methods;

  const watchAllFields = useWatch({ control: methods.control });

  useEffect(() => {
    trigger();
  }, [watchAllFields, trigger]);

  const onSubmit = async (data: ModerationPageSettingsType) => {
    const validated = await trigger();

    if (!validated) {
      return;
    }

    changeSettings(data);
  };

  return (
    <div className="my-2 h-screen overflow-auto">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <UseCaseSettingsCard title="Conversation model">
          <RHFSelect
            name="conversationModel"
            label="Conversation LLM"
            options={CONVERSATION_MODEL_OPTIONS}
          />

          <RHFSlider
            name="conversationTemperature"
            defaultValue={50}
            label="Temperature"
            doubled={getProviderByModelName(watchAllFields.conversationModel!) === 'openai'}
          />
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="Classification categories">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <RHFCheckbox name="categories.harassment/threatening" label="Harassment/Threatening" />
            <RHFCheckbox name="categories.hate" label="Hate" />
            <RHFCheckbox name="categories.hate/threatening" label="Hate/Threatening" />
            <RHFCheckbox name="categories.harassment" label="Harassment" />
            <RHFCheckbox name="categories.self-harm/instructions" label="Self-harm/instructions" />
            <RHFCheckbox name="categories.self-harm" label="Self-harm" />
            <RHFCheckbox name="categories.sexual/minors" label="Sexual/Minors" />
            <RHFCheckbox name="categories.violence/graphic" label="Violence/Graphic" />
            <RHFCheckbox name="categories.self-harm/intent" label="Self-harm/Intent" />
            <RHFCheckbox name="categories.violence" label="Violence" />
            <RHFCheckbox name="categories.sexual" label="Sexual" />
          </div>
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="Min. classification score">
          <RHFSlider name="minScore" defaultValue={50} label="Min. score" />
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="Filtering input">
          <RHFSelect name="flagBy" label="Flag by" options={FLAG_OPTIONS} />
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="System message">
          <RHFTextarea name="systemMessage" label="System Message" />
        </UseCaseSettingsCard>
      </FormProvider>
    </div>
  );
};
