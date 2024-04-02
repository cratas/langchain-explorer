'use client';

import { Button, Textarea } from '@/frontend/components/tailwind-components';
import { ConversationModelOptions } from '@/shared/types/common';
import { ChatRequestOptions } from 'ai';
import React, { FormEvent } from 'react';
import { ChatInputCosts } from './chat-input-costs';

type Props = {
  isLoading: boolean;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  stop: VoidFunction;
  templateTokensCount: number;
  input: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  modelName?: ConversationModelOptions;
};

export const ChatInput = ({
  handleSubmit,
  stop,
  isLoading,
  input,
  templateTokensCount,
  handleInputChange,
  modelName,
}: Props) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="chat-input">
      <div className="relative flex flex-row gap-1">
        {modelName && (
          <ChatInputCosts
            input={input}
            modelName={modelName}
            templateTokensCount={templateTokensCount}
          />
        )}

        <Textarea
          resize
          labelProps={{
            className: 'hidden',
          }}
          placeholder="Message ..."
          rows={1}
          value={input}
          onChange={handleInputChange}
          className="min-h-full !border-2 !border-browser-light pr-20 text-text-light placeholder-text-dark"
          onKeyDown={handleKeyPress}
          containerProps={{
            className: 'min-w-0 grid h-full',
          }}
        />

        <Button
          type="submit"
          onClick={isLoading ? stop : undefined}
          disabled={!isLoading && !input}
          size="sm"
          className="!absolute bottom-[6px] right-[6px] flex items-center gap-3 rounded bg-lighter-purple"
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
};
