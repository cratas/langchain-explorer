import { RHFInput, RHFSelect, RHFSlider, RHFTextarea, RHFUpload } from '@/frontend/components/form';
import FormProvider from '@/frontend/components/form/form-provider';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { MutableRefObject, useEffect, useImperativeHandle } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { UseCaseSettingsCard } from '@/frontend/components/common';
import { CustomChatbotPageSettingsType } from '@/frontend/types/custom-chatbot';
import {
  CONVERSATION_MODEL_OPTIONS,
  CustomChatbotSettingsSchema,
  EMBEDDING_MODEL_OPTIONS,
  SOURCE_OPTIONS,
} from '@/frontend/constants/custom-chatbot';
import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';

type Props = {
  formRef: MutableRefObject<unknown>;
  defaultSettings: CustomChatbotPageSettingsType;
  changeSettings: (data: CustomChatbotPageSettingsType) => void;
};

export const CustomChatbotPageSettings = ({ formRef, defaultSettings, changeSettings }: Props) => {
  useImperativeHandle(formRef, () => ({
    submit: () => onSubmit(getValues()),
  }));

  const methods = useForm<CustomChatbotPageSettingsType>({
    defaultValues: defaultSettings,
    resolver: yupResolver(CustomChatbotSettingsSchema),
  });

  const { handleSubmit, getValues, trigger, reset } = methods;

  const watchAllFields = useWatch({ control: methods.control });

  const { sourceType, conversationModel } = watchAllFields;

  useEffect(() => {
    trigger();
  }, [watchAllFields, trigger]);

  const onSubmit = async (data: CustomChatbotPageSettingsType) => {
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
            doubled={getProviderByModelName(conversationModel!) === 'openai'}
          />
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="Embedding">
          <RHFSelect
            name="embeddingModel"
            label="Embedding LLM"
            options={EMBEDDING_MODEL_OPTIONS}
          />

          <RHFInput type="number" name="chunkSize" defaultValue={1024} label="Chunk size" />

          <div className="flex flex-col gap-3 lg:flex-row ">
            <RHFInput type="number" name="chunkOverlap" defaultValue={200} label="Chunk overlap" />

            <RHFInput type="number" name="retrievalSize" defaultValue={3} label="Retrieval size" />
          </div>
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="Source">
          <>
            <RHFSelect name="sourceType" label="Source type" options={SOURCE_OPTIONS} />

            {sourceType === 'pdf' && <RHFUpload name="sourceFilePdf" accept=".pdf" />}

            {sourceType === 'text' && <RHFUpload name="sourceFileTxt" accept=".txt" />}

            {sourceType === 'cheerio-web-scraping' && (
              <RHFInput type="url" name="sourceUrl" label="Web URL" />
            )}

            {sourceType === 'github-repository' && (
              <RHFInput type="url" name="sourceUrl" label="GibHub repo URL" />
            )}
          </>
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="System message">
          <RHFTextarea name="systemMessage" label="System Message" />
        </UseCaseSettingsCard>
      </FormProvider>
    </div>
  );
};
