/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button } from '@material-tailwind/react';
import React, { useState } from 'react';
import { OPTIONS } from './types';

type Props = {
  onSubmit: (mc: string) => void;
};

export const ModerationInit = ({ onSubmit }: Props) => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>(OPTIONS[0].value);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-white">Moderation Layer</h1>
        <h6 className="text-md mt-2 max-w-[45rem] font-normal text-text-primary">
          {`The moderation layer is like a helpful guard, making sure the chat stays friendly and
          on-topic. It filters out anything that's not allowed, keeping the conversation safe and
          relevant for everyone. `}
        </h6>
      </div>

      <div className="mt-5 grid w-full grid-cols-3 gap-3 px-10">
        {OPTIONS.map(({ value, label, description }) => (
          <div
            key={value}
            onClick={() => setSelectedUseCase(value)}
            className={`${selectedUseCase === value ? 'border-lighter-purple' : 'border-browser-light'} w-full cursor-pointer rounded-md border-2 p-3 text-center`}
          >
            <h4 className="text-md font-bold text-white">{label}</h4>

            <p className="text-md mt-2 max-w-[45rem] text-sm font-normal text-text-primary">
              {description}
            </p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSubmit(selectedUseCase)}
        placeholder=""
        size="sm"
        className="mt-10 flex items-center rounded bg-lighter-purple"
      >
        Create ChatBot
      </Button>
    </div>
  );
};
