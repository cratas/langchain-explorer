import { Chip, Typography } from '@material-tailwind/react';
import React from 'react';

type Props<T> = {
  changedFields: (keyof T)[];
  onReset: VoidFunction;
  labels: { [K in keyof T]?: string };
};

export const ChangedSettingsFields = <T extends unknown>({
  onReset,
  changedFields,
  labels,
}: Props<T>) => (
  <div className="mt-2 flex min-w-[10rem] grow flex-col gap-2 rounded-lg border border-browser-light bg-background-lighter p-2 lg:mt-0">
    <div className="flex w-full items-center justify-between">
      <Typography className="text-sm font-bold text-text-light">Changed fields:</Typography>

      <Typography
        className="cursor-pointer text-sm font-bold text-lighter-purple underline"
        onClick={onReset}
      >
        Reset to default
      </Typography>
    </div>

    <div className="flex flex-wrap gap-2">
      {changedFields.map((field) => (
        <Chip
          key={field as string}
          value={labels[field]}
          className="inline-block border border-lighter-purple normal-case text-text-light"
        />
      ))}
    </div>
  </div>
);
