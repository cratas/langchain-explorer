/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputProps } from '@material-tailwind/react';
import { fData } from '@/utils/format-number';

type Props = InputProps & {
  accept: string;
  name: string;
};

export const RHFUpload = ({ name, accept }: Props) => {
  const { control, setValue } = useFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      setValue(name, selectedFile);
    }
  };

  return (
    <Controller
      name={name}
      render={({ field: { value }, fieldState: { error } }) => (
        <>
          <div className="inline-flex items-center justify-center rounded-lg border-2 border-gray-900 p-0.5">
            <label htmlFor="dropzone-file" className="cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-lighter-purple">
                <span className="icon-[mingcute--upload-2-fill] text-lg text-text-light" />
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
              />
            </label>

            <div className="mx-2 mr-auto">
              <p className="text-sm font-bold text-text-light">
                {value?.name ? value.name : 'Upload file'}{' '}
                {value?.size && (
                  <span className="text-nowrap text-text-primary">({fData(value.size)})</span>
                )}
              </p>
            </div>
          </div>
          {!!error && <p className="text-xs text-red-500">{error.message}</p>}
        </>
      )}
      control={control}
    />
  );
};
