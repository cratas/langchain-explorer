import { PINECONE_API_KEY } from '@/config-global';
import { Pinecone } from '@pinecone-database/pinecone';
import { logger } from '../../../logger';

/**
 * Singleton class for managing a connection to the Pinecone database.
 * This class ensures that only one instance of the Pinecone client exists throughout the application,
 * using the Singleton design pattern. It prevents direct instantiation and provides a global point of access
 * to the Pinecone client.
 */
export class PineconeClientConnectionSingleton {
  private static instance: Pinecone;

  /**
   * Private constructor to prevent direct instantiation.
   * Throws an error if called directly. Use PineconeClientConnectionSingleton.getInstance() instead.
   * @throws {Error} Always thrown to enforce singleton pattern.
   */
  private constructor() {
    throw new Error('Use PineconeClientConnectionSingleton.getInstance()');
  }

  /**
   * Provides the singleton instance of the Pinecone client.
   * If the instance does not exist, it creates one using the Pinecone API key from global configuration.
   * Otherwise, it returns the existing instance.
   *
   * @returns {Pinecone} The singleton instance of the Pinecone client.
   */
  public static getInstance(): Pinecone {
    if (!PineconeClientConnectionSingleton.instance) {
      logger.info('PineconeClientConnectionSingleton - Creating Pinecone client instance');

      PineconeClientConnectionSingleton.instance = new Pinecone({ apiKey: PINECONE_API_KEY });
    }

    return PineconeClientConnectionSingleton.instance;
  }
}
