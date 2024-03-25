import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from '@langchain/pinecone';
import { PINECONE_API_KEY, PINECONE_INDEX } from '@/config-global';

export const getPineconeStore = async (namespace: string) => {
  const pc = new Pinecone({ apiKey: PINECONE_API_KEY as string });
  const embedder = new OpenAIEmbeddings();

  const pcIndex = pc.Index(PINECONE_INDEX as string);

  const pcStore = await PineconeStore.fromExistingIndex(embedder, {
    pineconeIndex: pcIndex,
    namespace,
  });

  return pcStore;
};
