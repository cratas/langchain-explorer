/* eslint-disable no-restricted-syntax */
import { getPineconeStore } from '@/utils/get-pinecone-store';
import { NextResponse } from 'next/server';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { QA_TEMPLATE, STANDALONE_QUESTION_TEMPLATE } from '@/constants/custom-chatbot';
import { formatChatHistory } from '@/utils/format-chat-history';
import { ChatMistralAI } from '@langchain/mistralai';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { CHAT_MODEL_NAME } from '@/config-global';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, context } = body;

    const message = messages[messages.length - 1].content;

    // Handle streaming
    const { stream, handlers } = LangChainStream();

    // OpenAI recommendation
    const sanitizedQuestion = message.trim().replaceAll('\n', ' ');

    // const streamingModel = new ChatOpenAI({
    //   modelName: CHAT_MODEL_NAME,
    //   temperature: 0.2,
    //   openAIApiKey: process.env.OPENAI_API_KEY,
    //   streaming: true,
    // });

    // const anthropicStreamingModel = new ChatAnthropic({
    //   modelName: 'claude-3-haiku-20240307',
    //   anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    //   temperature: 0.2,
    //   streaming: true,
    // });

    const mistralStreamingModel = new ChatMistralAI({
      modelName: 'mistral-small',
      apiKey: process.env.MISTRAL_API_KEY,
      temperature: 0.2,
      streaming: true,
    });

    // const anthropicNonStreamingModel = new ChatAnthropic({
    //   modelName: 'claude-3-haiku-20240307',
    //   anthropicApiKey: process.env.MISTRAL_API_KEY,
    //   temperature: 0.2,
    // });

    // const mistralNonStreamingModel = new ChatMistralAI({
    //   modelName: 'mistral-small',
    //   apiKey: process.env.MISTRAL_API_KEY,
    //   temperature: 0.2,
    // });

    const nonStreamingModel = new ChatOpenAI({
      modelName: CHAT_MODEL_NAME,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.2,
    });

    const vectorStore = await getPineconeStore(context);

    const chain = ConversationalRetrievalQAChain.fromLLM(
      mistralStreamingModel,
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
