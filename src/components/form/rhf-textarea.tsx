import { Textarea, TextareaProps } from '@material-tailwind/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = TextareaProps & {
  name: string;
};

export const RHFTextarea = ({ name, label }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Textarea
            label={label}
            color="indigo"
            error={!!error}
            rows={5}
            className="text-text-light"
            labelProps={{ className: 'text-text-primary' }}
            containerProps={{
              className: 'w-full',
            }}
            {...field}
          />
          {error && <p className="text-xs text-red-500">{error.message}</p>}
        </div>
      )}
      control={control}
    />
  );
};
