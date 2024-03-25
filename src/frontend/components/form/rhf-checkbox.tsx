import { Checkbox, CheckboxProps } from '@material-tailwind/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = CheckboxProps & {
  name: string;
  label: string;
};

export const RHFCheckbox = ({ name, label }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Checkbox
          crossOrigin=""
          label={label}
          labelProps={{ className: 'text-text-light text-sm' }}
          {...field}
          checked={field.value}
        />
      )}
      control={control}
    />
  );
};
