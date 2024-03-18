import { Spinner } from '@material-tailwind/react';
import React from 'react';

export const SplashScreen = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Spinner className="h-10 w-10" />
  </div>
);
