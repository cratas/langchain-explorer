import React, { PropsWithChildren } from 'react';

type Props = {
  url?: string;
};

const TITLE = 'LangChain Explorer';

export const BrowserLayout = ({
  children,
  url = 'langchain.explorer.com',
}: PropsWithChildren<Props>) => (
  <div className="mb-10 overflow-hidden rounded-lg border border-gray-800 bg-browser-background">
    <div className="flex items-center">
      <div className="ml-2 flex items-center gap-2 p-1.5">
        <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-red-500" />
        <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-orange-300" />
        <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-green-500" />
      </div>

      <div className="mt-1.5 h-7 w-2 bg-browser-light">
        <div className="h-full w-full rounded-br-md bg-browser-background" />
      </div>

      <div className="bg-browser-dark mt-1.5 h-7 overflow-hidden">
        <div className="flex h-full items-center gap-1.5 overflow-hidden rounded-t-md bg-browser-light p-2">
          <span className="icon-[mdi--star] h-4 w-4 text-white" />

          <p className="text-nowrap text-sm font-normal text-gray-300">{TITLE}</p>

          <span className="icon-[streamline--delete-1-solid] ml-10 h-2 w-2" />
        </div>
      </div>

      <div className="mt-1.5 h-7 w-2 bg-browser-light">
        <div className="h-full w-full rounded-bl-md bg-browser-background" />
      </div>
    </div>
    <div className="flex flex-row items-center gap-3 bg-browser-light p-1.5">
      <span className="text-md icon-[tabler--arrow-left] text-lg text-white" />
      <span className="icon-[tabler--arrow-right] text-lg" />
      <span className="icon-[ooui--reload] text-white" />

      <div className="flex h-8 w-full items-center justify-between gap-2 overflow-hidden rounded-3xl bg-browser-finder px-3 text-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="icon-[solar--lock-bold]" />
          <p className="text-nowrap text-sm font-normal text-gray-500">{url}</p>
        </div>

        <span className="icon-[mdi--star-outline] h-4 w-4 text-white" />
      </div>

      <span className="icon-[mdi--dots-vertical] text-xl text-white" />
    </div>
    <div className="bg-browser-light">
      <div className="h-full max-h-[50rem] w-full overflow-auto rounded-b-lg">{children}</div>
    </div>
  </div>
);
