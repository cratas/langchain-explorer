'use client';

import { useResponsive } from '@/hooks/use-responsive';
import { Button, Drawer, Typography } from '@material-tailwind/react';
import React, { PropsWithChildren } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitButtonClick?: VoidFunction;
};

export const UseCaseSettingsDrawer = ({
  open,
  onSubmitButtonClick,
  setOpen,
  children,
}: PropsWithChildren<Props>) => {
  const closeDrawer = () => setOpen(false);

  const isLargeDevice = useResponsive('up', 'lg');

  const renderSubmitButton = (
    <Button className="bg-lighter-purple hover:bg-light-purple" onClick={onSubmitButtonClick}>
      Generate new Chatbot
    </Button>
  );

  const renderHeader = (
    <div className="flex min-w-[10rem] grow gap-2 rounded-lg border border-browser-light bg-background-lighter p-1 pr-2">
      <div className="flex items-center justify-center rounded-md bg-background-light px-2.5">
        <span className="icon-[uil--setting] text-3xl text-text-light" />
      </div>

      <div className="flex flex-col items-start justify-between overflow-hidden">
        <Typography className="truncate text-ellipsis text-sm text-text-primary">
          Set up your chatbot
        </Typography>
        <Typography className="text-md truncate text-lg font-bold text-text-light">
          Chatbot Customization
        </Typography>
      </div>
    </div>
  );

  const renderMobile = (
    <Drawer open={open} onClose={closeDrawer} className="flex flex-col bg-background-light p-4">
      {renderHeader}

      {children}

      {renderSubmitButton}
    </Drawer>
  );

  const renderLargeDevice = (
    <div className="flex h-screen w-[30rem] flex-col gap-4 border-r-2 border-browser-light bg-background-lighter/70 p-3">
      {renderHeader}

      {children}

      {renderSubmitButton}
    </div>
  );

  return <div>{isLargeDevice ? renderLargeDevice : renderMobile}</div>;
};
