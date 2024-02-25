import { Button } from '@material-tailwind/react';
import React from 'react';

type Props = {
  onBack: VoidFunction;
  fileName: string;
};

export const ChatbotRoomHeader = ({ onBack, fileName }: Props) => (
  <div className="flex w-full items-center justify-between border-b-2 border-browser-light pb-2">
    <Button
      onClick={onBack}
      placeholder=""
      variant="text"
      size="sm"
      className="flex items-center gap-1 pl-0 text-sm normal-case text-text-primary hover:bg-transparent"
    >
      <span className="icon-[iconamoon--arrow-left-2-duotone] text-2xl" />
      Create new ChatBot
    </Button>

    <p className="text-sm font-bold text-text-primary">{fileName}</p>
  </div>
);
