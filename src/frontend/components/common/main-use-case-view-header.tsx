import routes from '@/app/routes';
import { useResponsive } from '@/frontend/hooks/use-responsive';
import { Button, IconButton, Typography } from '@/frontend/components/tailwind-components';

import React from 'react';

type Props = {
  openMenu: VoidFunction;
  sourceName?: string;
};

export const MainUseCaseViewHeader = ({ openMenu, sourceName }: Props) => {
  const isSmallDevice = useResponsive('down', 'lg');

  return (
    <div className="m-3 flex items-center justify-between">
      {isSmallDevice && (
        <IconButton className="mr-2 bg-lighter-purple" size="sm" onClick={openMenu}>
          <div className="flex items-center justify-center">
            <span className="icon-[majesticons--menu-expand-right] text-3xl" />
          </div>
        </IconButton>
      )}

      {sourceName && <Typography className="font-bold">{sourceName}</Typography>}

      <a href={routes.home} className="ml-auto">
        <Button
          className="flex items-center gap-2 text-text-light hover:text-text-primary"
          size="sm"
        >
          <span className="icon-[fluent--home-24-filled] text-lg" />
          Home
        </Button>
      </a>
    </div>
  );
};
