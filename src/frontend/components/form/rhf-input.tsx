import { Input } from '@/frontend/components/tailwind-components';
import { InputProps } from '@material-tailwind/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = InputProps & {
  name: string;
};

export const RHFInput = ({ name, label, type = 'number' }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Input
            type={type}
            label={label}
            crossOrigin=""
            error={!!error}
            color="indigo"
            className="text-text-light"
            labelProps={{ className: 'text-text-primary' }}
            {...field}
          />
          {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
        </div>
      )}
      control={control}
    />
  );
};
