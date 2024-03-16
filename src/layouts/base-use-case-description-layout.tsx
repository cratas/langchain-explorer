import React, { PropsWithChildren } from 'react';

export const BaseUseCaseDescriptionLayout = ({ children }: PropsWithChildren) => (
  <div
    className="mb-5 mt-7 flex flex-col gap-10 rounded-lg bg-gradient-to-br from-lighter-purple via-transparent
  via-30%
 to-transparent p-[1px] backdrop:blur-3xl"
  >
    <div
      className="to-black/98 flex flex-col gap-10 rounded-lg
    bg-gradient-to-br 
    from-background-light
    via-background-dark
    via-30%
    to-black/60 p-4"
    >
      {children}
    </div>
  </div>
);
