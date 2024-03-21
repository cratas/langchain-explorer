import { Slider, SliderProps, Typography } from '@material-tailwind/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = SliderProps & {
  name: string;
  label: string;
};

export const RHFSlider = ({ name, label }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      render={({ field }) => (
        <div>
          <div className="flex justify-between">
            <Typography className="mb-1 text-xs text-text-primary">{label}</Typography>

            <Typography className="mb-1 text-sm font-bold text-text-light">
              {(Number(field.value) / 100).toFixed(2)}
            </Typography>
          </div>
          <Slider size="sm" barClassName="bg-lighter-purple" {...field} />
        </div>
      )}
      control={control}
    />
  );
};
