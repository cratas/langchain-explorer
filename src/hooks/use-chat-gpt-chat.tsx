/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
import { paths } from '@/app/api/endpoints';
import { gptMessageScrollHelper, gptMessagesAtom } from '@/global-states/atoms';
import { Message } from 'ai';
import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useState } from 'react';

export const useChatGptChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const [messagesHistory, setMessagesHistory] = useAtom(gptMessagesAtom);

  const [, notifyScrolling] = useAtom(gptMessageScrollHelper);

  const sendMessage = useCallback(
    async (question: string) => {
      notifyScrolling(uuidv4());

      try {
        setIsLoading(true);

        const userMessage = { content: question, role: 'user' } as Message;

        const response = await fetch(paths.openAI, {
          method: 'POST',
          body: JSON.stringify({
            messages: [...messagesHistory, userMessage],
          }),
        });

        setIsLoading(false);

        let answer = '';
        const textDecoder = new TextDecoder();

        if (response.body !== null) {
          const reader = response.body?.getReader();

          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            const decodedString = textDecoder.decode(value, { stream: true });

            answer += decodedString;

            setMessage({ content: answer, role: 'assistant' } as Message);
            notifyScrolling(uuidv4());
          }

          setMessagesHistory([
            ...messagesHistory,
            userMessage,
            { content: answer, role: 'assistant' } as Message,
          ]);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    },
    [messagesHistory, setMessagesHistory, notifyScrolling]
  );

  return { sendMessage, answer: message, isLoading, isError };
};
