import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const formData = await request.formData();

  const isDefault = formData.get('isDefault') as string;
  const file = formData.get('file') as Blob;

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX as string);

  try {
    await pineconeIndex.deleteAll();
  } catch {
    console.log('There are no documents to delete.');
  }

  const fileToLoad =
    isDefault === 'true' ? `${process.cwd()}/public/pdf/The-Almanack-Of-Naval-Ravikant.pdf` : file;

  const loader = new PDFLoader(fileToLoad, {
    splitPages: false,
  });
  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    separator: '\n',
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  await PineconeStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' }),
    {
      pineconeIndex,
    }
  );

  return NextResponse.json({ message: 'Pinecone index created' }, { status: 201 });
};
