/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, Checkbox, Typography } from '@material-tailwind/react';
import React from 'react';

type Props = {
  onSubmit: (anonymization: boolean) => void;
  anonymization: boolean;
  setAnonymization: (anonymization: boolean) => void;
};

export const CustomerSupportInit = ({ onSubmit, setAnonymization, anonymization }: Props) => {
  const handleAnonymizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnonymization(e.target.checked);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-white">Customer Support</h1>
        <h6 className="text-md mt-2 max-w-[45rem] font-normal text-text-primary">
          {`Customer support just got smarter! Need details about your orders? Just ask,
           and our support chat, powered by LangChain with Function calls, will fetch the info for you. 
           You can also use anonymization if you want to keep your data private.`}
        </h6>
      </div>

      <div className="mt-5 rounded-xl border-2 border-browser-light pl-1 pr-4">
        <Checkbox
          crossOrigin=""
          className="rounded-md border-2 border-lighter-purple checked:border-lighter-purple checked:bg-lighter-purple"
          checked={anonymization}
          onChange={handleAnonymizationChange}
          label={
            <Typography placeholder="" className="flex text-sm font-bold text-white">
              Use Anonymization
              <Typography
                as="span"
                placeholder=""
                className="ml-1 text-sm font-normal text-text-primary"
              >
                {'- '}ChatBot will not mention any personal data
              </Typography>
            </Typography>
          }
        />
      </div>

      <Button
        onClick={() => onSubmit(anonymization)}
        placeholder=""
        size="sm"
        className="mt-10 flex items-center rounded bg-lighter-purple"
      >
        Create ChatBot
      </Button>
    </div>
  );
};
