import { Slider, Typography } from '@/frontend/components/tailwind-components';
import { SliderProps } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = SliderProps & {
  name: string;
  label: string;
  doubled?: boolean;
};

const normalizeValue = (value: number, doubled: boolean) => {
  const normalizedValue = (value / 100).toFixed(4);

  return doubled ? Number(normalizedValue) * 2 : Number(normalizedValue);
};

export const RHFSlider = ({ name, label, doubled = false }: Props) => {
  const { control, setValue: setFormValue } = useFormContext();

  const currentValue = useWatch({ control })[name];

  const [value, setValue] = useState<number>(currentValue * 100);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));

    const finalValue = normalizeValue(Number(e.target.value), doubled);

    setFormValue(name, finalValue);
  };

  useEffect(() => {
    const finalValue = normalizeValue(Number(value), doubled);

    setFormValue(name, finalValue);
  }, [doubled]);

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
