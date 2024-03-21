/* eslint-disable no-case-declarations */
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { NextResponse } from 'next/server';
import { DEFAULT_FILE_NAME } from '@/constants/custom-chatbot';
import { SourceOptions } from '@/sections/custom-chatbot-page/types';

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();

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
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX as string);

    // deleting all documents from index aside from the default one (Naval Almanack) to save space
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

    // using loaders to load document from file
    const documents = await loadDocumentsByType(sourceType, file || url);

    // splitting documents into chunks
    const splitter = new CharacterTextSplitter({
      separator: '\n',
      chunkSize: Number(chunkSize),
      chunkOverlap: Number(chunkOverlap),
    });

    // storing chunks into variable to be sent to Pinecone
    const splitDocs = await splitter.splitDocuments(documents);

    await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
      pineconeIndex,
      namespace: (fileName || url) as string,
    });

    return NextResponse.json({ message: 'Pinecone index created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save context' }, { status: 500 });
  }
};

const loadDocumentsByType = async (sourceType: SourceOptions, source: Blob | string) => {
  let loader: PDFLoader | TextLoader | GithubRepoLoader | CheerioWebBaseLoader;

  switch (sourceType) {
    case 'pdf':
      loader = new PDFLoader(source, {
        splitPages: true,
      });
      break;
    case 'text':
      loader = new TextLoader(source);
      break;
    case 'github-repository':
      loader = new GithubRepoLoader(source as string, {
        branch: 'main',
        recursive: false,
        unknown: 'warn',
        maxConcurrency: 5,
      });
      break;
    case 'cheerio-web-scraping':
      loader = new CheerioWebBaseLoader(source as string);
      break;
    default:
      throw new Error('Invalid source type');
  }
  const documents = await loader.load();

  return documents;
};
