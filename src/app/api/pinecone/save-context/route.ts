/* eslint-disable no-case-declarations */
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse } from 'next/server';
import { DocumentsLoaderFactory } from '@/backend/helpers/documents-loader-factory';
import { EmbeddingModelOptions, SourceOptions } from '@/shared/types/common';
import { CUSTOMER_SUPPORT_DEFAULT_FILE_NAME } from '@/shared/constants/common';
import { OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX } from '@/config-global';

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();

    const embeddingModel = formData.get('embeddingModel') as EmbeddingModelOptions;
    const sourceType = formData.get('sourceType') as SourceOptions;
    const chunkSize = formData.get('chunkSize') as string;
    const chunkOverlap = formData.get('chunkOverlap') as string;
    const fileName = formData.get('fileName');
    const url = formData.get('url');
    const file = formData.get('file') as Blob;

    if (!chunkSize || !chunkOverlap) {
      return NextResponse.json({ message: 'Missing Chunk size or Chunk overlap' }, { status: 400 });
    }

    if (sourceType === 'pdf' || sourceType === 'text') {
      if (!file) {
        return NextResponse.json({ message: 'Missing Context file' }, { status: 400 });
      }
    }

    if (sourceType === 'cheerio-web-scraping' || sourceType === 'github-repository') {
      if (!url) {
        return NextResponse.json({ message: 'Missing Source URL' }, { status: 400 });
      }
    }

    const pc = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });

    const pineconeIndex = pc.Index(PINECONE_INDEX as string);

    // deleting all documents from index aside from the default one (Naval Almanack) to save space
    try {
      const { namespaces } = await pineconeIndex.describeIndexStats();

      if (namespaces) {
        Object.keys(namespaces)
          .filter((ns) => ns !== CUSTOMER_SUPPORT_DEFAULT_FILE_NAME)
          .forEach(async (namespace) => {
            await pineconeIndex.namespace(namespace).deleteAll();
          });
      }
    } catch {
      throw new Error('Failed to delete documents from Pinecone index');
    }

    const loader = DocumentsLoaderFactory.createLoader(sourceType, file || url);

    const documents = await loader.load();

    // splitting documents into chunks
    const splitter = new CharacterTextSplitter({
      separator: '\n',
      chunkSize: Number(chunkSize),
      chunkOverlap: Number(chunkOverlap),
    });

    // storing chunks into variable to be sent to Pinecone
    const splitDocs = await splitter.splitDocuments(documents);

    // TODO: create class structure for getting embeddings by model
    const embedder = new OpenAIEmbeddings({
      modelName: embeddingModel,
      openAIApiKey: OPENAI_API_KEY as string,
    });

    await PineconeStore.fromDocuments(splitDocs, embedder, {
      pineconeIndex,
      namespace: (fileName || url) as string,
    });

    return NextResponse.json({ message: 'Pinecone index created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save context' }, { status: 500 });
  }
};
