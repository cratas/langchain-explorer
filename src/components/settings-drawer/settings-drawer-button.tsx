import { IconButton } from '@material-tailwind/react';
import React from 'react';

type Props = {
  onClick: VoidFunction;
};

export const SettingsDrawerButton = ({ onClick }: Props) => (
  <IconButton
    size="sm"
    onClick={onClick}
    variant="text"
    className="mr-2 justify-center bg-lighter-purple text-white hover:bg-light-purple"
  >
    <div className="flex items-center justify-center">
      <span className="icon-[ci--menu-alt-03] cursor-pointer text-2xl text-white" />
    </div>
  </IconButton>
);
