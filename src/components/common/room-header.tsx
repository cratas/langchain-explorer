import { Button } from '@material-tailwind/react';
import React from 'react';

type Props = {
  onBack: VoidFunction;
  onClear: VoidFunction;
  onBackText: string;
  title: string;
};

export const RoomHeader = ({ onBack, onClear, title, onBackText }: Props) => (
  <div className="flex w-full items-center justify-between border-b-2 border-browser-light pb-2">
    <Button
      onClick={onBack}
      placeholder=""
      variant="text"
      size="sm"
      className="flex items-center gap-1 pl-0 text-sm normal-case text-text-primary hover:bg-transparent"
    >
      <span className="icon-[iconamoon--arrow-left-2-duotone] text-2xl" />
      {onBackText}
    </Button>

    <p className="text-md font-bold text-white">{title}</p>

    <Button
      onClick={onClear}
      placeholder=""
      size="sm"
      variant="outlined"
      className="flex items-center gap-1 border-2 border-browser-light text-sm normal-case text-text-primary focus:ring-0 active:ring-0"
    >
      Clear chat history
    </Button>
  </div>
);
