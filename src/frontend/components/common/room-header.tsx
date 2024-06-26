import { Button, IconButton, Tooltip } from '@/frontend/components/tailwind-components';
import React, { ReactNode } from 'react';

type Props = {
  onBack?: VoidFunction;
  onClear: VoidFunction;
  onBackText?: string;
  title: string | ReactNode;
};

export const RoomHeader = ({ onBack, onClear, title, onBackText }: Props) => (
  <div className="flex w-full flex-col items-center justify-between gap-2 pb-2 md:gap-0">
    <div className="flex w-full flex-row items-center justify-between">
      {onBackText ? (
        <Button
          onClick={onBack}
          variant="text"
          size="sm"
          className="flex items-center gap-1 pl-0 text-sm normal-case text-text-primary hover:bg-transparent"
        >
          <span className="icon-[iconamoon--arrow-left-2-duotone] text-2xl" />
          {onBackText}
        </Button>
      ) : (
        <div className="h-10 w-1" />
      )}

      <Tooltip
        className="bg-white text-background-dark"
        content="Clear chat history"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 },
        }}
      >
        <IconButton
          onClick={onClear}
          size="sm"
          variant="outlined"
          className="flex items-center gap-1 border-2 border-browser-light text-sm normal-case text-text-primary focus:ring-0 active:ring-0"
        >
          <div className="flex items-center justify-center">
            <span className="text-md icon-[pajamas--clear]" />
          </div>
        </IconButton>
      </Tooltip>
    </div>

    <p className="text-md text-center font-bold text-text-light lg:-mt-8">{title}</p>
  </div>
);
