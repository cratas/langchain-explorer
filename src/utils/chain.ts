import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from 'langchain/memory';
import { getPineconeStore } from './get-pinecone-store';

export const getChain = async () => {
  const model = new ChatOpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 });

  const vectorStore = await getPineconeStore();

  return ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever({ searchType: 'similarity', k: 3 }),
    {
      memory: new BufferMemory({
        memoryKey: 'chat_history',
        inputKey: 'question', // The key for the input to the chain
        outputKey: 'text', // The key for the final conversational output of the chain
        returnMessages: true,
      }),
    }
  );
};
