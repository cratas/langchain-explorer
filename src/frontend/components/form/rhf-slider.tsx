import { Slider, Typography } from '@/frontend/components/tailwind-components';
import { SliderProps } from '@material-tailwind/react';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = SliderProps & {
  name: string;
  label: string;
};

export const RHFSlider = ({ name, label }: Props) => {
  const { control, setValue: setFormValue, getValues } = useFormContext();

  const [value, setValue] = useState<number>(getValues(name) * 100);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));

    const normalizedValue = (Number(e.target.value) / 100).toFixed(4);

    setFormValue(name, normalizedValue);
  };

  return (
    <Controller
      name={name}
      render={({ field }) => (
        <div>
          <div className="flex justify-between">
            <Typography className="mb-1 text-xs text-text-primary">{label}</Typography>

            <Typography className="mb-1 text-sm font-bold text-text-light">
              {field.value}
            </Typography>
          </div>
          <Slider
            size="sm"
            barClassName="bg-lighter-purple"
            {...field}
            value={value}
            onChange={handleChangeValue}
          />
        </div>
      )}
      control={control}
    />
  );
};
