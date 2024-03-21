import { IconButton, Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import Typewriter from 'typewriter-effect';

type Props = {
  proposals: string[];
};

export const InputWhisperer = ({ proposals }: Props) => {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <div className="my-3 flex items-center justify-between gap-3 rounded-md bg-browser-finder/30 py-1.5 pl-4 pr-1.5 backdrop-blur-sm">
      <Typography className="text-nowrap font-normal text-text-light">
        <Typewriter
          options={{
            strings: proposals,
            autoStart: true,
            loop: true,
            delay: 5,
            deleteSpeed: 1,
            cursor: '',
          }}
        />
      </Typography>

      <div>
        <IconButton size="sm" onClick={() => setVisible(false)}>
          <div className="flex items-center justify-center">
            <span className="icon-[material-symbols--cancel] bg-text-primary text-xl" />
          </div>
        </IconButton>
      </div>
    </div>
  ) : null;
};
