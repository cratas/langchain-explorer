import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { getPineconeStore } from './get-pinecone-store';

export const getChain = async () => {
  const model = new ChatOpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 });

  const vectorStore = await getPineconeStore();

  // const memory = new BufferMemory({
  //   memoryKey: 'chat_history',
  //   returnMessages: true,
  //   inputKey: 'question',
  //   outputKey: 'answer',
  // });

  return ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever({ searchType: 'similarity', k: 3 })
  );
};
