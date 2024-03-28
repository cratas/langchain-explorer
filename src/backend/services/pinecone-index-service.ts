import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import { EmbeddingLLMProvider, EmbeddingModelOptions } from '@/shared/types/common';
import { PineconeClientConnectionSingleton } from '../db/pinecone-client-connection-singleton';
import { EmbeddingLLMFactory } from '../helpers/embedding-llm-factory';
import { getProviderByModelName } from '../utils/get-provider-by-model';
import { logger } from '../../../logger';

/**
 * Service class for managing operations on a Pinecone index.
 * Provides functionality to interact with a Pinecone vector database, such as deleting namespaces
 * and saving documents to a vector store. It uses PineconeClientConnectionSingleton for database
 * connection and EmbeddingLLMFactory for creating embedder objects.
 */
export class PineconeIndexService {
  /**
   * The Pinecone index instance.
   * @private
   */
  private _index: Index<RecordMetadata>;

  /**
   * Constructs a PineconeIndexService object.
   * Initializes a connection to a Pinecone index with the specified name.
   *
   * @param {string} indexName - The name of the Pinecone index to connect to.
   * @throws {Error} Throws an error if the index with the specified name is not found.
   */
  constructor(indexName: string) {
    try {
      this._index = PineconeClientConnectionSingleton.getInstance().Index(indexName);

      logger.info(`PineconeIndexService - Connected to Pinecone index ${indexName}`);
    } catch {
      logger.error(`PineconeIndexService - Index ${indexName} not found`);

      throw new Error(`Index ${indexName} not found`);
    }
  }

  /**
   * Deletes all namespaces in the Pinecone index except the provided namespace.
   *
   * @param {string} providedNamespace - The namespace to retain in the index.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} Throws an error if the operation fails.
   */
  public async deleteAllNamespacesExceptProvidedNamespace(
    providedNamespace: string
  ): Promise<void> {
    try {
      const { namespaces } = await this._index.describeIndexStats();

      if (namespaces) {
        Object.keys(namespaces)
          .filter((ns) => ns !== providedNamespace)
          .forEach(async (namespace) => {
            await this._index.namespace(namespace).deleteAll();
          });

        logger.info(`PineconeIndexService - Deleted all namespaces except ${providedNamespace}`);
      }
    } catch {
      logger.error('PineconeIndexService - Failed to delete namespaces');

      throw new Error('Failed to delete documents from Pinecone index');
    }
  }

  /**
   * Saves the given documents to the vector store using a specified embedding model and namespace.
   *
   * @param {Document<Record<string, any>>[]} documents - An array of documents to be saved.
   * @param {EmbeddingModelOptions} embeddingModel - The embedding model options to be used.
   * @param {string} namespace - The namespace in the index where the documents will be saved.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} Throws an error if saving the documents fails.
   */
  public async saveDocumentsToVectorStore(
    documents: Document<Record<string, any>>[],
    embeddingModel: EmbeddingModelOptions,
    namespace: string
  ): Promise<void> {
    try {
      const embedder = EmbeddingLLMFactory.createObject(
        getProviderByModelName(embeddingModel) as EmbeddingLLMProvider,
        embeddingModel
      );

      await PineconeStore.fromDocuments(documents, embedder, {
        pineconeIndex: this._index,
        namespace,
      });

      logger.info('PineconeIndexService - Saved documents to vector store');
    } catch (error) {
      logger.error(`PineconeIndexService - Failed to save documents to Pinecone index ${error}`);

      throw new Error(`Failed to save documents to Pinecone index ${error}`);
    }
  }
}
