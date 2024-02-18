import React from 'react';

export const NoMessages = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lighter-purple">
      <span className="icon-[lucide--bot] bg-black text-xl font-bold" />
    </div>
    <p className="text-md text-center font-bold text-text-primary md:text-xl">
      How can I help you today?
    </p>
  </div>
);
