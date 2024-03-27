import { PINECONE_API_KEY } from '@/config-global';
import { Pinecone } from '@pinecone-database/pinecone';

export class PineconeClientConnectionSingleton {
  private static instance: Pinecone;

  private constructor() {
    throw new Error('Use PineconeClientConnectionSingleton.getInstance()');
  }

  public static getInstance(): Pinecone {
    if (!PineconeClientConnectionSingleton.instance) {
      PineconeClientConnectionSingleton.instance = new Pinecone({ apiKey: PINECONE_API_KEY });
    }

    return PineconeClientConnectionSingleton.instance;
  }
}
