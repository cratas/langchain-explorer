import { RHFSelect, RHFSlider, RHFTextarea } from '@/components/form';
import FormProvider from '@/components/form/form-provider';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { MutableRefObject, useEffect, useImperativeHandle, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ChangedSettingsFields, UseCaseSettingsCard } from '@/components/common';
import {
  ModerationPageSettingsType,
  ModerationSettingsSchema,
  SETTINGS_FORM_LABELS,
} from './types';
import { CONVERSATION_MODEL_OPTIONS } from '../custom-chatbot-page/types';

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

  const { handleSubmit, getValues, trigger, reset } = methods;

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

  const changedFields = useMemo(
    () =>
      Object.entries(watchAllFields)
        .filter(
          ([key, value]) =>
            JSON.stringify(value) !==
            JSON.stringify(defaultSettings[key as keyof ModerationPageSettingsType])
        )
        .map(([key]) => key as keyof ModerationPageSettingsType),
    [watchAllFields, defaultSettings]
  );

  return (
    <>
      {!!changedFields.length && (
        <ChangedSettingsFields<ModerationPageSettingsType>
          onReset={() => reset()}
          changedFields={changedFields}
          labels={SETTINGS_FORM_LABELS}
        />
      )}

      <div className="my-2 h-screen overflow-auto">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <UseCaseSettingsCard title="Conversation model">
            <RHFSelect
              name="conversationModel"
              label="Conversation LLM"
              options={CONVERSATION_MODEL_OPTIONS}
            />

            <RHFSlider name="conversationTemperature" defaultValue={50} label="Temperature" />
          </UseCaseSettingsCard>

          <UseCaseSettingsCard title="Moderation">
            <RHFSlider name="minScore" defaultValue={50} label="Min. propability score" />
          </UseCaseSettingsCard>

          <UseCaseSettingsCard title="System message">
            <RHFTextarea name="systemMessage" label="System Message" />
          </UseCaseSettingsCard>
        </FormProvider>
      </div>
    </>
  );
};
