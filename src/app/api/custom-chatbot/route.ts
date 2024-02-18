import { CHAT_MODEL_NAME } from '@/config-global';
import { getPineconeStore } from '@/utils/get-pinecone-store';
import { ChatOpenAI } from '@langchain/openai';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { QA_TEMPLATE, STANDALONE_QUESTION_TEMPLATE } from '@/constants/custom-chatbot';
import { formatChatHistory } from '@/utils/format-chat-history';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { message, history, context } = body;

    // OpenAI recommendation
    const sanitizedQuestion = message.trim().replaceAll('\n', ' ');

    const model = new ChatOpenAI({ modelName: CHAT_MODEL_NAME, temperature: 0 });

    const vectorStore = await getPineconeStore(context);

    const retriever = vectorStore.asRetriever();

    const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
      qaTemplate: QA_TEMPLATE,
      questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
      returnSourceDocuments: true,
    });

    const res = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: formatChatHistory(history),
    });

    console.log('res', res);

    return NextResponse.json({ role: 'bot', content: res.text, id: uuidv4() });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
