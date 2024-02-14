/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Spinner } from '@material-tailwind/react';
import { ChatBotInit } from '../chatbot-init';
import { ChatBotRoom } from '../chatbot-room';

export const ChatBotView = () => {
  const [contextFile, setContextFile] = useState<string>('');

  const [contextFileIsLoading, setContextFileIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');

  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContext = async () => {
      setContextFileIsLoading(true);

      const response = await fetch('/api/pinecone/current-context');
      const data = await response.json();

      const { fileName } = data || {};

      if (response.status === 200) {
        setContextFile(fileName);
      }
      setContextFileIsLoading(false);
    };

    fetchContext();
  }, []);

  const initializeChatBotRoom = async (
    defaultMessage: string,
    newContextFile: File,
    pdfChanged: boolean
  ) => {
    if (pdfChanged) {
      setIsLoading(true);

      const formData = new FormData();
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
    }
    setInitialized(true);
    setContextFile(newContextFile.name);
    setSystemMessage(defaultMessage);
  };

  return (
    <div className="flex h-[35rem] flex-col items-center justify-center bg-background-dark p-3">
      {isLoading || contextFileIsLoading ? (
        <Spinner />
      ) : initialized ? (
        <ChatBotRoom
          fileName={contextFile}
          onBack={() => setInitialized(false)}
          systemMessage={systemMessage}
        />
      ) : (
        <ChatBotInit onSubmit={initializeChatBotRoom} currentFileName={contextFile} />
      )}
    </div>
  );
};
