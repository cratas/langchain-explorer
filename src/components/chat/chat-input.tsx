'use client';

import { Button, Input } from '@material-tailwind/react';
import { ChatRequestOptions } from 'ai';
import React, { FormEvent } from 'react';

type Props = {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  buttonLoading?: boolean;
  input: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export const ChatInput = ({
  handleSubmit,
  buttonLoading = false,
  input,
  handleInputChange,
}: Props) => (
  <form onSubmit={handleSubmit}>
    <div className="relative">
      <Input
        labelProps={{
          className: 'hidden',
        }}
        multiple
        crossOrigin=""
        placeholder="Message ..."
        value={input}
        onChange={handleInputChange}
        className="!border-2 !border-browser-light pr-20 text-white placeholder-text-dark"
        containerProps={{
          className: 'min-w-0',
        }}
      />
      <Button
        type="submit"
        loading={buttonLoading}
        placeholder=""
        size="sm"
        disabled={!input || buttonLoading}
        className="!absolute right-1 top-1 flex items-center gap-3 rounded bg-lighter-purple"
      >
        {!buttonLoading && <span className="icon-[fluent--send-20-filled] h-4 w-4" />}
      </Button>
    </div>
  </form>
);
