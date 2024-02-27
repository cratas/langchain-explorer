import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { Message } from 'ai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';

const TEMPLATE = `
Current conversation:
{chat_history}

User: {input}
AI:`;

const formatMessage = (message: Message) => `${message.role}: ${message.content}`;

export const getOpenAIChatChainStream = async (messages: Message[], temperature = 0.2) => {
  const currentMessageContent = messages[messages.length - 1].content;
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

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
    chat_history: formattedPreviousMessages.join('\n'),
    input: currentMessageContent,
  });

  return stream;
};
