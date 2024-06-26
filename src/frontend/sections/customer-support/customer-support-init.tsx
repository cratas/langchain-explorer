/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button } from '@/frontend/components/tailwind-components';
import { OPTIONS } from '@/frontend/constants/customer-support';
import React, { useState } from 'react';

type Props = {
  onSubmit: (selectedUseCaseKey: string) => void;
};

export const CustomerSupportInit = ({ onSubmit }: Props) => {
  const [selectedUseCase, setSelectedUseCase] = useState(OPTIONS[1].value);

  return (
    <div className="my-5 flex w-full flex-col items-center overflow-auto">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-text-light">Customer Support</h1>
        <h6 className="text-md mt-2 max-w-[45rem] font-normal text-text-primary">
          {`Need details about your orders? Just ask,
           and our support chat, powered by LangChain with Function calls. 
           You can choose the role between user and administrator (the user should not be able to find out sensitive information about other users).`}
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
