import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from '@langchain/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { initPinecone } from './pinecone-client';

export const initChain = async () => {
  const model = new OpenAI({});

  const pinecone = await initPinecone();

  const pineconeIndex = pinecone.Index('custom-chatbot');

  const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
    pineconeIndex,
    textKey: 'text',
  });

  return ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    returnSourceDocuments: true,
  });
};
