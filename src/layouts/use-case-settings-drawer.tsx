'use client';

import { useResponsive } from '@/hooks/use-responsive';
import { Drawer } from '@material-tailwind/react';
import React from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const UseCaseSettingsDrawer = ({ open, setOpen }: Props) => {
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const isLargeDevice = useResponsive('up', 'lg');

  const renderMobile = (
    <Drawer placeholder="" open={open} onClose={closeDrawer} className="p-4">
      sdf
    </Drawer>
  );

  const renderLargeDevice = (
    <div className="h-full w-[30rem] border-r border-browser-light bg-background-light">fsd</div>
  );

  return <>{isLargeDevice ? renderLargeDevice : renderMobile}</>;
};
