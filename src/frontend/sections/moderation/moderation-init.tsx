/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button } from '@/frontend/components/tailwind-components';
import { OPTIONS } from '@/frontend/constants/moderation';
import React, { useState } from 'react';

type Props = {
  onSubmit: (selectedUseCaseKey: string) => void;
};

export const ModerationInit = ({ onSubmit }: Props) => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>(OPTIONS[1].value);

  return (
    <div className="my-5 flex w-full flex-col items-center overflow-auto">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-text-light">Moderation Layer</h1>
        <h6 className="text-md mt-2 max-w-[45rem] font-normal text-text-primary">
          {`The moderation layer is like a helpful guard, making sure the chat stays friendly and
          on-topic. It filters out anything that's not allowed, keeping the conversation safe and
          relevant for everyone. `}
        </h6>
      </div>

      <div className="mt-5 grid w-full grid-cols-1 gap-3 px-10 md:grid-cols-3">
        {OPTIONS.map(({ value, label, description }) => (
          <div
            key={value}
            onClick={() => setSelectedUseCase(value)}
            className={`${selectedUseCase === value ? 'border-lighter-purple' : 'border-browser-light'} w-full cursor-pointer rounded-md border-2 p-3 text-center`}
          >
            <h4 className="text-md font-bold text-text-light">{label}</h4>

            <p className="text-md mt-2 max-w-[45rem] text-sm font-normal text-text-primary">
              {description}
            </p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSubmit(selectedUseCase)}
        size="sm"
        className="mt-10 flex items-center rounded bg-lighter-purple"
      >
        Create Chatbot
      </Button>
    </div>
  );
};
