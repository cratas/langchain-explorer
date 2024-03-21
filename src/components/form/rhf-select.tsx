import { Option, Select, SelectProps } from '@material-tailwind/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Omit<SelectProps, 'children'> & {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};

export const RHFSelect = ({ name, label, options }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Select
          error={!!error}
          label={label}
          className="text-text-light"
          labelProps={{ className: 'text-text-primary' }}
          color="indigo"
          // onChange={(value) => console.log('value', value)}
          {...field}
        >
          {options.map((option) => (
            <Option key={option.label} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}
      control={control}
    />
  );
};
