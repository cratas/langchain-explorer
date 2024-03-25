import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { Message } from 'ai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { formatChatHistory } from './format-chat-history';

export const getOpenAIChatChainStream = async (
  messages: Message[],
  template: string,
  temperature = 0.2
) => {
  const currentMessageContent = messages[messages.length - 1].content;
  const formattedChatHistory = formatChatHistory(messages.slice(0, -1));

  const prompt = PromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature,
    modelName: 'gpt-3.5-turbo',
    streaming: true,
    maxTokens: 1000,
  });

  const outputParser = new HttpResponseOutputParser();

  const chain = RunnableSequence.from([prompt, model, outputParser]);

  const stream = await chain.stream({
    chat_history: formattedChatHistory,
    input: currentMessageContent,
  });

  return stream;
};
