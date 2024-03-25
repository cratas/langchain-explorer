import { SETTINGS_FORM_LABELS } from '@/frontend/sections/custom-chatbot-page/constants';
import { CustomChatbotPageSettingsType } from '@/frontend/sections/custom-chatbot-page/types';
import { Chip, Typography } from '@material-tailwind/react';
import React from 'react';

type Props = {
  changedFields: (keyof CustomChatbotPageSettingsType)[];
  onReset: VoidFunction;
};

export const ChangedSettingsFields = ({ onReset, changedFields }: Props) => (
  <div className="mt-2 flex min-w-[10rem] grow flex-col gap-2 rounded-lg border border-browser-light bg-background-lighter p-2 lg:mt-0">
    <div className="flex w-full items-center justify-between">
      <Typography className="text-sm font-bold text-text-light">Changed fields:</Typography>

      <Typography
        className="cursor-pointer text-sm font-bold text-lighter-purple underline"
        onClick={onReset}
      >
        Reset to default
      </Typography>
    </div>

    <div className="flex flex-wrap gap-2">
      {changedFields.map((field) => (
        <Chip
          key={field}
          value={SETTINGS_FORM_LABELS[field]}
          className="inline-block border border-lighter-purple normal-case text-text-light"
        />
      ))}
    </div>
  </div>
);
