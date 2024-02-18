import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from '@langchain/pinecone';

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
  throw new Error('Pinecone environment or api key vars missing');
}

export const getPineconeStore = async () => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
  const embedder = new OpenAIEmbeddings();

  const pcIndex = pc.Index(process.env.PINECONE_INDEX as string);

  const pcStore = await PineconeStore.fromExistingIndex(embedder, {
    pineconeIndex: pcIndex,
  });

  return pcStore;
};
