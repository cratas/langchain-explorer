import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export const POST = async (request: Request) => {
  const formData = await request.formData();

  const file = formData.get('file') as string;
  const fileName = formData.get('fileName') as string;

  await fs.writeFile(
    `${process.cwd()}/src/app/data.json`,
    JSON.stringify({ currentFile: fileName })
  );

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX as string);

  // Deleting old index values
  // -----------------------------------------------------------------------------
  await pineconeIndex.deleteAll();
  // -----------------------------------------------------------------------------

  const loader = new PDFLoader(file, {
    splitPages: false,
  });
  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    separator: '\n',
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // uploading chunks to pinecone
  await PineconeStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' }),
    {
      pineconeIndex,
    }
  );

  return NextResponse.json({ message: 'Pinecone index created' }, { status: 201 });
};
