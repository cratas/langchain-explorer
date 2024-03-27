import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import { EmbeddingLLMProvider, EmbeddingModelOptions } from '@/shared/types/common';
import { PineconeClientConnectionSingleton } from '../db/pinecone-client-connection-singleton';
import { EmbeddingLLMFactory } from '../helpers/embedding-llm-factory';
import { getProviderByModelName } from '../utils/get-provider-by-model';

export class PineconeIndexService {
  private _index: Index<RecordMetadata>;

  constructor(indexName: string) {
    try {
      this._index = PineconeClientConnectionSingleton.getInstance().Index(indexName);
    } catch {
      throw new Error(`Index ${indexName} not found`);
    }
  }

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
      }
    } catch {
      throw new Error('Failed to delete documents from Pinecone index');
    }
  }

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
    } catch (error) {
      throw new Error(`Failed to save documents to Pinecone index ${error}`);
    }
  }
}
