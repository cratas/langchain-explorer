'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { fData } from '@/utils/format-number';
import React from 'react';

type Props = {
  accept: string;
  file: File | null;
  setFile: (file: File) => void;
};

export const FileUpload = ({ accept, setFile, file }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="mb-2 inline-flex items-center justify-center rounded-lg border-2 border-gray-900 p-0.5">
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

      {file && (
        <div className="mx-2">
          {/* <p className="text-sm font-bold text-text-dark">{fData(file.size)}</p> */}
          <p className="text-sm font-bold text-text-light">
            {file.name} <span className="text-nowrap text-text-primary">({fData(file.size)})</span>
          </p>
        </div>
      )}
    </div>
  );
};
