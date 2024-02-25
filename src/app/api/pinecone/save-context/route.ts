import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse } from 'next/server';
import { DEFAULT_FILE_NAME } from '@/constants/chat';

export const POST = async (request: Request) => {
  const formData = await request.formData();

  const fileName = formData.get('fileName');
  const file = formData.get('file') as Blob;

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const pineconeIndex = pc.Index(process.env.PINECONE_INDEX as string);

  try {
    const { namespaces } = await pineconeIndex.describeIndexStats();

    if (namespaces) {
      Object.keys(namespaces)
        .filter((ns) => ns !== DEFAULT_FILE_NAME)
        .forEach(async (namespace) => {
          await pineconeIndex.namespace(namespace).deleteAll();
        });
    }
  } catch {
    throw new Error('Failed to delete documents from Pinecone index');
  }

  const loader = new PDFLoader(file, {
    splitPages: false,
  });
  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    separator: '\n',
    chunkSize: 1024,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
    pineconeIndex,
    namespace: fileName as string,
  });

  return NextResponse.json({ message: 'Pinecone index created' }, { status: 201 });
};
