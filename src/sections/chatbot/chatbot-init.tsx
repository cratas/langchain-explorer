import { FileUpload } from '@/components/upload';
import { DEFAULT_FILE_NAME, DEFAULT_SYSTEM_MESSAGE } from '@/constants/custom-chatbot';
import { Button, Textarea } from '@material-tailwind/react';
import React, { useState } from 'react';

type Props = {
  onSubmit: (systemMessage: string, file: File, pdfChanged: boolean) => void;
  setContextFile: (contextFile: File) => void;
  contextFile: File | null;
};

export const ChatBotInit = ({ onSubmit, setContextFile, contextFile }: Props) => {
  const [systemMessage, setSystemMessage] = useState(DEFAULT_SYSTEM_MESSAGE);

  const handleChangeSystemMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemMessage(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(systemMessage, contextFile!, contextFile?.name === DEFAULT_FILE_NAME);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-white">{`Let's set our Q&A ChatBot`}</h1>
        <h6 className="text-md font-normal text-text-primary">
          You can provide (or use default) a system message and a PDF file to start the conversation
        </h6>
      </div>

      <FileUpload accept=".pdf" setFile={setContextFile} file={contextFile} />

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
