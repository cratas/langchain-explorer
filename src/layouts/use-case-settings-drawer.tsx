'use client';

import { useResponsive } from '@/hooks/use-responsive';
import { Drawer } from '@material-tailwind/react';
import React, { PropsWithChildren } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const UseCaseSettingsDrawer = ({ open, setOpen, children }: PropsWithChildren<Props>) => {
  const closeDrawer = () => setOpen(false);

  const isLargeDevice = useResponsive('up', 'lg');

  const renderMobile = (
    <Drawer placeholder="" open={open} onClose={closeDrawer} className="bg-background-light p-4">
      {children}
    </Drawer>
  );

  const renderLargeDevice = (
    <div className="h-full w-[30rem] border-r-2 border-browser-light bg-background-light">
      {children}
    </div>
  );

  return <>{isLargeDevice ? renderLargeDevice : renderMobile}</>;
};
