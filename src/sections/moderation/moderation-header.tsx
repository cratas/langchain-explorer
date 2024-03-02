import { Button } from '@material-tailwind/react';
import React from 'react';

type Props = {
  onClear: VoidFunction;
};

export const ModerationHeader = ({ onClear }: Props) => (
  <div className="flex w-full items-center justify-between border-b-2 border-browser-light pb-2">
    <Button
      placeholder=""
      onClick={onClear}
      size="sm"
      variant="outlined"
      className="ml-auto flex items-center gap-1 border-2 border-browser-light text-sm normal-case text-text-primary focus:ring-0 active:ring-0"
    >
      Clear chat history
    </Button>
  </div>
);
