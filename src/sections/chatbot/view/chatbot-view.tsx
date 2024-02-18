/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Spinner } from '@material-tailwind/react';
import { ChatBotInit } from '../chatbot-init';
import { ChatBotRoom } from '../chatbot-room';

export const ChatBotView = () => {
  const [contextFile, setContextFile] = useState<string>('');
  const [systemMessage, setSystemMessage] = useState('');

  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializeChatBotRoom = async (
    defaultMessage: string,
    newContextFile: File,
    isDefaultFile: boolean
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('isDefault', isDefaultFile.toString());
    formData.append('file', newContextFile);
    formData.append('fileName', newContextFile.name);

    const response = await fetch('/api/pinecone/save-context', {
      method: 'POST',
      body: formData,
    });
    setIsLoading(false);

    if (response.status === 201) {
      setInitialized(true);
    } else if (response.status === 500) {
      alert('Error while creating Pinecone index');
    }
    setInitialized(true);

    setContextFile(newContextFile.name);
    setSystemMessage(defaultMessage);
  };

  return (
    <div className="flex h-[35rem] flex-col items-center justify-center bg-background-dark p-3">
      {isLoading ? (
        <Spinner />
      ) : initialized ? (
        <ChatBotRoom
          fileName={contextFile}
          onBack={() => setInitialized(false)}
          systemMessage={systemMessage}
        />
      ) : (
        <ChatBotInit onSubmit={initializeChatBotRoom} />
      )}
    </div>
  );
};
