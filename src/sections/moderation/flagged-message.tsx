import { Message } from 'ai';
import React from 'react';
import { Chip, Typography } from '@material-tailwind/react';
import { getDataFromFlaggedMessage } from './utils/get-data-from-flagged-message';

type Props = {
  message: Message;
};

export const FlaggedMessage = ({ message }: Props) => {
  const { category, score } = getDataFromFlaggedMessage(message);

  return (
    <div className="flex items-center justify-between rounded-xl border-2 border-red-600 p-3">
      <div className="flex items-center gap-3">
        <span className="icon-[mingcute--warning-fill] bg-red-600 text-2xl" />
        <Typography placeholder="" className="text-sm font-normal text-text-light" color="red">
          The message was evaluated as inappropriate content.
        </Typography>
      </div>

      <Chip value={`${Math.ceil(score)}% ${category}`} size="lg" />
    </div>
  );
};
