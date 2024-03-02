/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Button, Spinner, Textarea } from '@material-tailwind/react';
import { DEFAULT_FILE_NAME, DEFAULT_SYSTEM_MESSAGE } from '@/constants/custom-chatbot';
import { FileUpload } from '@/components/upload';
import { useInitChatbot } from '../hooks';
import { ChatBotRoom } from '../chatbot-room';

const defaultFakeFile = {
  name: DEFAULT_FILE_NAME,
  size: 1200000,
  type: 'application/pdf',
  lastModified: Date.now(),
};

export const ChatBotView = () => {
  const { initializeChatBot, isLoading, isError, initialized, setInitialized } = useInitChatbot();

  const [contextFile, setContextFile] = useState<File>(defaultFakeFile as unknown as File);
  const [systemMessage, setSystemMessage] = useState(DEFAULT_SYSTEM_MESSAGE);

  useEffect(() => {
    if (isError) {
      alert('Something went wrong, please try again.');
    }
  }, [isError]);

  const initializeChatBotRoom = async () => {
    if (defaultFakeFile.name === contextFile.name) {
      setInitialized(true);
      return;
    }

    await initializeChatBot(contextFile);
  };

  const handleChangeSystemMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemMessage(e.target.value);
  };

  const handleReinitializeChatBot = () => {
    setInitialized(false);
    setContextFile(defaultFakeFile as unknown as File);
    setSystemMessage(DEFAULT_SYSTEM_MESSAGE);
  };

  const renderInitChatbot = (
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
        onClick={initializeChatBotRoom}
        placeholder=""
        size="sm"
        className="mt-5 flex items-center rounded bg-lighter-purple hover:bg-light-purple"
      >
        Create ChatBot
      </Button>
    </div>
  );

  return (
    <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
      {isLoading ? (
        <Spinner />
      ) : initialized ? (
        <ChatBotRoom
          fileName={contextFile?.name!}
          onBack={handleReinitializeChatBot}
          systemMessage={systemMessage}
        />
      ) : (
        renderInitChatbot
      )}
    </div>
  );
};
