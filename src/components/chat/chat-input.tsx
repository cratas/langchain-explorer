'use client';

import { Button, Input } from '@material-tailwind/react';
import React, { useCallback, useState } from 'react';

type Props = {
  handleSendMessage: (message: string) => void;
  buttonLoading?: boolean;
};

export const ChatInput = ({ handleSendMessage, buttonLoading = false }: Props) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    if (input) {
      handleSendMessage(input);
      setInput('');
    }
  }, [input, handleSendMessage]);

  const handleSubmitOnEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="relative">
      <Input
        labelProps={{
          className: 'hidden',
        }}
        multiple
        onKeyUp={handleSubmitOnEnter}
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
        loading={buttonLoading}
        onClick={handleSubmit}
        placeholder=""
        size="sm"
        disabled={!input}
        className="!absolute right-1 top-1 flex items-center gap-3 rounded bg-lighter-purple"
      >
        {!buttonLoading && <span className="icon-[fluent--send-20-filled] h-4 w-4" />}
      </Button>
    </div>
  );
};
