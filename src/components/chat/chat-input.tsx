'use client';

import { Button, Input } from '@material-tailwind/react';
import { ChatRequestOptions } from 'ai';
import React, { FormEvent } from 'react';

type Props = {
  isLoading: boolean;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  stop: VoidFunction;
  input: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export const ChatInput = ({ handleSubmit, stop, isLoading, input, handleInputChange }: Props) => (
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
        onClick={isLoading ? stop : undefined}
        placeholder=""
        disabled={!isLoading && !input}
        size="sm"
        className="!absolute right-1 top-1 flex items-center gap-3 rounded bg-lighter-purple"
      >
        {isLoading ? (
          <span className="icon-[solar--stop-bold] h-4 w-4" />
        ) : (
          <span className="icon-[fluent--send-20-filled] h-4 w-4" />
        )}
      </Button>
    </div>
  </form>
);
