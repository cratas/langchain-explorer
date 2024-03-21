import { RHFInput, RHFSelect, RHFSlider, RHFTextarea } from '@/components/form';
import FormProvider from '@/components/form/form-provider';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { MutableRefObject, useEffect, useImperativeHandle } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { RHFUpload } from '@/components/form/rhf-upload';
import { UseCaseSettingsCard } from '@/components/common';
import { CONVERSATION_MODEL_OPTIONS, SOURCE_OPTIONS } from './types';
import { CustomChatbotSettingsSchema, defaultValues } from './constants';

type Props = {
  formRef: MutableRefObject<unknown>;
};

export const CustomChatbotPageSettings = ({ formRef }: Props) => {
  useImperativeHandle(formRef, () => ({
    submit: () => onSubmit(getValues()),
  }));

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(CustomChatbotSettingsSchema),
  });

  const { handleSubmit, getValues, trigger } = methods;

  const watchAllFields = useWatch({ control: methods.control });

  const { sourceType } = watchAllFields;

  useEffect(() => {
    trigger();
  }, [watchAllFields, trigger]);

  const onSubmit = async (data: any) => {
    const validated = await trigger();

    if (!validated) {
      return;
    }

    console.log('result', data);
  };

  return (
    <div className="h-screen overflow-auto">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <UseCaseSettingsCard title="Conversation model">
          <RHFSelect
            name="conversationModel"
            label="Conversation LLM"
            options={CONVERSATION_MODEL_OPTIONS}
          />

          <RHFSlider name="conversationTemperature" defaultValue={50} label="Temperature" />
        </UseCaseSettingsCard>

        <UseCaseSettingsCard title="Embedding">
          <RHFSelect
            name="embeddingModel"
            label="Embedding LLM"
            options={[{ value: 'chatgpt-3.5', label: 'chatgpt-3.5' }]}
          />

          <RHFSlider name="embeddingTemperature" defaultValue={50} label="Temperature" />

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
