import { FileUpload } from '@/components/upload';
import { Button, Textarea } from '@material-tailwind/react';
import React, { useState } from 'react';

const DEFAULT_MESSAGE = `Imagine you are Naval Ravikant and you want to give advice to the user you're interacting with that may ask you questions or advice.
I will provide you context snippets from "The Almanack of Naval Ravikant" from a vector database to help you answer the user's questions.
Don't mention context snippets when replying to user and only mention yourself by your first name.`;

const DEFAULT_FILE_NAME = 'The-Almanack-Of-Naval-Ravikant.pdf';

const defaultFakeFile = {
  name: DEFAULT_FILE_NAME,
  size: 1200000,
  type: 'application/pdf',
  lastModified: Date.now(),
};

type Props = {
  onSubmit: (systemMessage: string, file: File, pdfChanged: boolean) => void;
};

export const ChatBotInit = ({ onSubmit }: Props) => {
  const [file, setFile] = useState<File | null>(defaultFakeFile as unknown as File);

  const [systemMessage, setSystemMessage] = useState(DEFAULT_MESSAGE);

  const handleChangeSystemMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemMessage(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(systemMessage, file!, file?.name === DEFAULT_FILE_NAME);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-white">{`Let's set our Q&A ChatBot`}</h1>
        <h6 className="text-md font-normal text-text-primary">
          You can provide (or use default) a system message and a PDF file to start the conversation
        </h6>
      </div>

      <FileUpload accept=".pdf" setFile={setFile} file={file} />

      <Textarea
        labelProps={{
          className: 'hidden',
        }}
        placeholder="System message ..."
        rows={8}
        value={systemMessage}
        onChange={handleChangeSystemMessage}
        className="!border-2 !border-gray-900 text-white placeholder-text-dark"
        containerProps={{
          className: 'w-full md:w-[40rem] min-w-0',
        }}
      />

      <Button
        onClick={handleSubmit}
        placeholder=""
        size="sm"
        className="mt-5 flex items-center rounded bg-lighter-purple"
      >
        Create ChatBot
      </Button>
    </div>
  );
};
