import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from '@langchain/pinecone';
import { EMBEDDING_MODEL_NAME } from '@/config-global';

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
  throw new Error('Pinecone environment or api key vars missing');
}

export const getPineconeStore = async (namespace: string) => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
  const embedder = new OpenAIEmbeddings({ modelName: EMBEDDING_MODEL_NAME });

  const pcIndex = pc.Index(process.env.PINECONE_INDEX as string);

  const pcStore = await PineconeStore.fromExistingIndex(embedder, {
    pineconeIndex: pcIndex,
    namespace,
  });

  return pcStore;
};
