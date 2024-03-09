import { Typography } from '@material-tailwind/react';
import React from 'react';

type Props = {
  proposals: string[];
};

export const InputWhisperer = ({ proposals }: Props) => {
  console.log('InputWhisperer');

  return (
    <div className="absolute bottom-[3.8rem] inline-flex">
      <div className="inline-flex items-center justify-between gap-3 rounded-md bg-browser-finder/30 px-4 py-2 backdrop-blur-sm">
        <Typography placeholder="" className="font-normal text-text-primary">
          What is the most ordered product?
        </Typography>

        <span className="icon-[material-symbols--cancel] text-xl" />
      </div>
    </div>
  );
};
