/* eslint-disable no-restricted-syntax */
import { CHAT_MODEL_NAME } from '@/config-global';
import { getPineconeStore } from '@/utils/get-pinecone-store';
import { ChatOpenAI } from '@langchain/openai';
import { NextResponse } from 'next/server';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { QA_TEMPLATE, STANDALONE_QUESTION_TEMPLATE } from '@/constants/custom-chatbot';
import { formatChatHistory } from '@/utils/format-chat-history';
import { StreamingTextResponse, LangChainStream } from 'ai';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, context } = body;

    const message = messages[messages.length - 1].content;

    // Handle streaming
    const { stream, handlers } = LangChainStream();

    // OpenAI recommendation
    const sanitizedQuestion = message.trim().replaceAll('\n', ' ');

    const streamingModel = new ChatOpenAI({
      modelName: CHAT_MODEL_NAME,
      temperature: 0,
      streaming: true,
    });
    const nonStreamingModel = new ChatOpenAI({
      modelName: CHAT_MODEL_NAME,
      temperature: 0,
    });

    const vectorStore = await getPineconeStore(context);

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      }
    );

    chain.invoke(
      {
        question: sanitizedQuestion,
        chat_history: formatChatHistory(messages),
      },
      { callbacks: [handlers] }
    );

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
