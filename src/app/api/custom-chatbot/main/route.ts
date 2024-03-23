/* eslint-disable no-restricted-syntax */
import { QA_TEMPLATE, STANDALONE_QUESTION_TEMPLATE } from '@/constants/custom-chatbot';
import { formatChatHistory } from '@/utils/format-chat-history';
import { getPineconeStore } from '@/utils/get-pinecone-store';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainStream, StreamingTextResponse } from 'ai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, context, conversationModel, conversationTemperature, retrievalSize } = body;

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

    const mistralStreamingModel = new ChatOpenAI({
      modelName: conversationModel,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: conversationTemperature,
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
      modelName: conversationModel,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: conversationTemperature,
    });

    const vectorStore = await getPineconeStore(context);

    const chain = ConversationalRetrievalQAChain.fromLLM(
      mistralStreamingModel,
      vectorStore.asRetriever({ k: retrievalSize ?? 3 }),
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
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
