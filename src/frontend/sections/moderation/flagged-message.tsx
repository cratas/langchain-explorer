import { Message } from 'ai';
import React from 'react';
import { Chip, Typography } from '@material-tailwind/react';
import { getDataFromFlaggedMessage } from './utils/get-data-from-flagged-message';

type Props = {
  message: Message;
};

export const FlaggedMessage = ({ message }: Props) => {
  const { matches } = getDataFromFlaggedMessage(message);

  return (
    <div className="flex flex-col items-center justify-between gap-2 rounded-xl border-2 border-red-600 p-3 md:flex-row md:gap-0 ">
      <div className="flex items-center gap-3">
        <span className="icon-[mingcute--warning-fill] bg-red-600 text-2xl" />
        <Typography className="text-sm font-normal text-text-light" color="indigo">
          The message was evaluated as inappropriate content.
        </Typography>
      </div>

      <div className="flex flex-wrap gap-2">
        {matches.map(({ score, category }: any) => (
          <Chip key={category} value={`${Math.ceil(score)}% ${category}`} size="lg" />
        ))}
      </div>
    </div>
  );
};
